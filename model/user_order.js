'use strict';

//const crypto = require('crypto');

var order = function (db) {

  if (!(this instanceof order)) {
    return new order(db);
  }

  this.db = db;

  this.randOrderNum = () => {
    let r = 1000 + parseInt(Math.random() * 1500);
    return r;
  };

  this.makeId = (cstr = '') => {
    return `${Date.now()}${Math.random()}${cstr}`;
  };

};

order.prototype.get = async function (user_id, order_id) {
  let r = await this.db.table('point_order')
              .where('id=? AND user_id=?', [order_id, user_id])
              .select('id,order_time,order_status,goods_id,points,number');
  if (r.rowCount <= 0) {
    return null;
  }
  let ord = r.rows[0];
  r = await this.db.table('goods')
                .where('id=?', [ r.rows[0].goods_id ])
                .select('goods_name,points,goods_image');
  
  if (r.rowCount > 0) {
    ord.goods_image = r.rows[0].goods_image;
    ord.goods_name = r.rows[0].goods_name;
  }
  return ord;
};

order.prototype.orderList = async function (user_id, page=1) {
  let olist = await this.db.table('point_order')
                .where('user_id=?',[user_id])
                .order('timeint DESC')
                .limit(20, 20*(page-1))
                .select('id,order_time,order_status,goods_id,points,number');

  return olist.rows;
};

order.prototype.count = async function (user_id) {
  let total = await this.db.table('point_order')
                .where('user_id=?',[user_id])
                .count();
  return total;
};

/**
 * 暂时不支持一个订单多个商品，后续更新再说。
 */
order.prototype.insert = async function (user_id, goods_id, number = 1) {
  var order_id = this.makeId(user_id);
  console.log(this.db);
  let r = await this.db.transcation(async function (db) {
    let g = await db.table('trash_goods').where('id=?',[goods_id]).select('*');
    let u = await db.table('users').where('id=?',[user_id]).select('*');
    let goods = g.rows[0];
    let uinfo = u.rows[0];

    if (goods.storage < number) {
      return {
        status : 'FAILED',
        errmsg : '商品库存不足'
      };
    }

    let can_use_points = uinfo.points - uinfo.frozen_points;
    if (can_use_points < (goods.points * number) ) {
      return {
        status : 'FAILED',
        errmsg : '剩余积分不足'
      };
    }

    await db.table('users').where('id=?',[user_id]).update({
      frozen_points : uinfo.frozen_points + (goods.points * number)
    });

    await db.table('trash_goods').where('id=?',[goods_id]).update({
      storage : goods.storage - number
    });
    
    var tm = new Date();
    await db.table('point_order').insert({
      id : order_id,
      user_id : user_id,
      goods_id : goods_id,
      order_time : `${tm.toLocaleString()}`,
      year : tm.getFullYear(),
      timeint : Date.now(),
      number : number,
      points : goods.points * number
    });

    return {
      status : 'OK',
      data : order_id
    };

  });

  if (r.error !== null) {
    return {
      status : 'FAILED',
      errmsg : `请求失败，请稍后再试。（${r.error.message}）`
    };
  }

  return r.callbackResult;

};

order.prototype.delete = async function (user_id, order_id) {
  let r = await this.db.table('point_order')
            .where('id=? AND user_id=? AND order_status>0', [order_id, user_id])
            .delete();
  if (r.rowCount <= 0) {
    return false;
  }
  return true;
};

order.prototype.cancel = async function (user_id, order_id) {
  let r = await this.db.transcation(async function (db) {
    let ret = await db.table('point_order')
                  .where('id=? AND user_id=? AND order_status=0', [order_id, user_id])
                  .select();
    if (ret.rowCount <= 0) {
      return {
        status : 'failed',
        errmsg : '没有发现有效订单，请确认订单号是否正确，或者订单已经完成无法撤销。'
      };
    }

    //恢复已冻结的积分，并设置订单状态为取消

    await db.table('users').where('id=?',[user_id]).update({
      frozen_points : `@frozen_points-${ret.rows[0].points}`
    });

    await db.table('trash_goods').where('id=?',[ret.rows[0].goods_id])
              .update({
                storage : `@storage+${ret.rows[0].number}`
              });

    await db.table('point_order').where('id=?',[order_id])
              .update({
                order_status : 2
              });
    return {
      status : 'ok',
      errmsg : '订单已取消。'
    }
  });

  if (r.error !== null) {
    return {
      status : 'failed',
      errmsg : '订单取消失败，请稍后再试'
    };
  }

  return r;
};


module.exports = order;
