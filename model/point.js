'use strict';

const crypto = require('crypto');

var point = function (db) {
  if (!(this instanceof point)) {
    return new point(db);
  }

  this.db = db;

  this.table = function () {
    return this.db.table('point_log');
  };

  this.makeId = (cstr = '') => {
    var h = crypto.createHash('sha1');
    h.update(`${cstr}${Math.random()}${Date.now()}`);
    return h.digest('hex');
  };

};

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

point.prototype.insert = async function (user_id, admin_id, data) {
  data.verify_code = this.makeCode();
  data.code_time = parseInt((Date.now() / 1000) + 3600);
  data.id = this.makeId(user_id);

  var d = new Date();
  data.logtime = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  data.admin_id = admin_id;
  data.user_id = user_id;
  data.year = d.getFullYear();

  let r = await this.db.transcation(async (db) => {
    let upd = {
      points : `@points ${data.point_type == 'increase' ? '+' : '-'} ${data.points}`
    };
    await this.db.table('users').where({id : user_id}).update(upd);
    await this.db.table('point_log').insert(data);
  });
  if (r.error === null) {
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
  let r = await this.table().where(cond).order('logtime DESC').limit(20, offset);
  return r.rows;
};

point.prototype.count = async function (user_id) {
  var sql = 'SELECT COUNT(*) as total FROM point_log WHERE user_id=$1';
  var r = await this.db.db.query(sql, [user_id]);
  if (r.rowCount <= 0) {
    return 0;
  }
  return r.rows[0]['total'];
};

module.exports = point;
