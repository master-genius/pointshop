'use strict';

var goods = function (db) {
  if (!(this instanceof goods)) {
    return new goods(db);
  }

  this.db = db();

  this.makeId = (cstr = '') => {
    var h = crypto.createHash('sha1');
    h.update(`${cstr}${Math.random()}${Date.now()}`);
    return h.digest('hex');
  };
};

goods.prototype.get = async function (id) {
  let g = await this.db.table('trash_goods')
                  .where('id=?',[id])
                  .select('id,goods_name,points,goods_image,detail,storage');
  if (g.rowCount <= 0) {
    return null;
  }
  return g.rows[0];
};

goods.prototype.goodsList = async function (page = 1, kwd = '') {
  let goodslist = await this.db.table('trash_goods')
                    .where('goods_name ILIKE ?', [`%${kwd}%`])
                    .limit(20, 20*(page -1))
                    .select('id,goods_name,goods_image,points');
  return goodslist.rows;
};


goods.prototype.count = async function (kwd = '') {
  let total = await this.db.table('trash_goods')
                .where('goods_name ILIKE ?', [`%${kwd}%`])
                .count();
  return total;
};


goods.prototype.add = async function (data) {
  data.id = this.makeId();

  let r = await this.db.talbe('trash_goods')
                  .insert(data);
  if (r.rowCount <= 0) {
    return false;
  }
  return data.id;
};


goods.prototype.delete = async function (id) {
  let r = await this.db.table('trash_goods').where('id=?',[id]).delete();
  if (r.rowCount <= 0) {
    return false;
  }
  return true;
};


goods.prototype.update = async function (id, data) {
  if (data.id !== undefined) {
    delete data.id;
  }

  let r = await this.db.table('trash_goods')
                  .where('id=?',[id])
                  .update(data);

  if (r.rowCount <= 0) {
    return false;
  }

  return true;

};

module.exports = goods;
