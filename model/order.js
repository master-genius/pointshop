'use strict';

const crypto = require('crypto');

var order = function (db) {

  if (!(this instanceof order)) {
    return new order(db);
  }

  this.db = db;

  this.randOrderNum = () => {
    let r = 1000 + parseInt(Math.random() * 1500);
    return r;
  };

  this.makeId = () => {
    return `${Date.now()}${Math.random()}${r}`;
  };

};

order.prototype.get = async function (id) {
  let r = await this.db.table('point_order')
            .where('id=?', [id])
            .select('id,user_id,order_time,order_status,goods_id,points,number');
  if (r.rowCount <= 0) {
    return null;
  }
  return r.rows[0];
};

order.prototype.insert = async function (data) {

};

order.prototype.delete = async function (id) {

};

order.prototype.list = async function (args = {page:1, year:0, user_id:null}) {
  let cond = {};
  if (args.user_id !== null) {
    cond.user_id = args.user_id;
  }
  if (args.year && args.year > 0) {
    cond.year = args.year;
  }

  let olist = await this.db.table('point_order')
        .where(cond)
        .order('timeint DESC')
        .limit(20, 20*(args.page-1))
        .select('id,order_id,user_id,order_time,order_status,goods_id,points,number');

  return olist.rows;
};

order.prototype.count = async function (user_id = null) {
  if (user_id === null) {
    let total = await this.db.table('point_order').count();
    return total;
  }
  let total = await this.db.table('point_order')
                .where('user_id = ?' , [user_id])
                .count();
  return total;
};

/**
 * 确认订单后，减去冻结的积分，并更新库存，更新订单状态。
 */
order.prototype.confirm = async function (order_id) {
  let r = await this.db.transcation(async function (db) {
    let ret = await db.table('point_order')
                .where('id=? AND order_status=0',[order_id]).select();

    let ord = ret.rows[0];

    await db.table('users').where('id=?',[ord.user_id]).update({
      points : `@points-${ord.points}`,
      frozen_points : `@frozen_points-${ord.points}`
    });

    await db.table('point_order')
            .where('id=?', [order_id]).update({
              order_status : 1
            });

    await db.table('trash_goods').where('id=?',[ord.goods_id]).update({
      storage : `@storage-${ord.number}`
    });

    return {
      status : 'ok',
      errmsg : '订单已确认'
    };

  });

  if (r.error === null) {
    return r.callbackResult;
  }

  return {
    status : 'failed',
    errmsg : `确认订单失败，请稍后再试。（${r.error.message}）`
  };

};

module.exports = order;
