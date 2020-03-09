'use strict';

const crypto = require('crypto');

var point = function (db) {
  if (!(this instanceof point)) {
    return new point(db);
  }

  this.db = db;

  this.makeId = (cstr = '') => {
    var h = crypto.createHash('sha1');
    h.update(`${cstr}${Math.random()}${Date.now()}`);
    return h.digest('hex');
  };

};

/**
 * 生成验证码的方式其实依靠其他字段来保证即使重复也不会有问题，
 * 一个字段是code_time用来保证有效期，一个是code_status标记是否已经被使用。
 */

point.prototype.makeCode = () => {
  var charr = [
    '2','3','4','5','6','7','8','9','2','5','8','6'
  ];

  let tmp = '';
  for (let i=0; i < 6; i++) {
    tmp += charr[ parseInt(Math.random() * 50) % charr.length ];
  }

  return `1${tmp}`;
};

point.prototype.get = async function () {

};

point.prototype.insert = async function (admin_id, data) {
  data.verify_code = this.makeCode();
  data.code_time = parseInt(Date.now() / 1000);
  data.id = this.makeId(user_id);

  var d = new Date();
  data.logtime = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  data.admin_id = admin_id;
  data.year = d.getFullYear();

  var _db = this.db();

  /* let r = await this.db.transcation(async (db) => {
    let upd = {
      points : `@points ${data.point_type == 'increase' ? '+' : '-'} ${data.points}`
    };
    await this.db.table('users').where({id : user_id}).update(upd);
    await this.db.table('point_log').insert(data);
  }); */

  let r = null;

  r = await _db.table('trash_point')
        .where('id=?',[data.trash_type])
        .get('weight,cash,point');
  
  if (r.rowCount <= 0 ) {
    return false;
  }

  data.points = parseInt(r.rows[0].point * data.trash_weight);

  r = await _db.table('point_log').insert(data);
  if (r.rowCount > 0) {
    return data.verify_code;
  }
  console.log(r.error);
  return false;
  
};

point.prototype.delete = function () {

};

point.prototype.list = async function (user_id, offset = 0, year = 0) {
  let cond = {
    user_id : user_id
  };
  if (typeof year === 'number' && year > 0) {
    cond.year = year;
  }
  let r = await this.db().where(cond).order('logtime DESC').limit(20, offset);
  return r.rows;
};

point.prototype.count = async function (user_id) {
  var sql = 'SELECT COUNT(*) as total FROM point_log WHERE user_id=$1';
  var r = await this.db().db.query(sql, [user_id]);
  if (r.rowCount <= 0) {
    return 0;
  }
  return r.rows[0]['total'];
};

module.exports = point;
