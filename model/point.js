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

point.prototype.get = async function () {
  var sql = 'SELECT ';
};

point.prototype.insert = async function (user_id, admin_id, data) {
  await this.db.query('BEGIN');

  var r = null;
  var usql = `UPDATE users SET points ${data.point_type == 'increase' ? '+' : '-'}= $1 WHERE id=$2`;
  r = await this.db.query(usql, [ data.points, user_id ]);

  var sql = 'INSERT INTO point_log'
      +'(id,user_id,logtime,year,point_type,post_trash,trash_weight,trash_type,points)'
      +' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  data.id = this.makeId(user_id);

  var d = new Date();
  data.logtime = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  data.admin_id = admin_id;
  data.user_id = user_id;
  data.year = d.getFullYear();

  r = await this.db.query(sql, [
    data.id, data.user_id, data.logtime, 
    data.year, data.point_type, data.post_trash,
    data.trash_weight, data.trash_type, data.points
  ]);

  await this.db.query('COMMIT');

  if (r.rowCount<=0) {
    return false;
  }
  return true;
};

point.prototype.delete = function () {

};

/**
 * 根据year查询，使用logtime逆序排列
 */
point.prototype.list = async function (user_id, offset=0, year = 0) {
  var sql = 'SELECT id,logtime,year,point_type,post_trash,trash_weight,trash_type FROM point_log WHERE user_id=$1';
  if (typeof year === 'number' && year > 0) {
    sql += ` AND year=${year}`;
  }
  sql += ` LIMIT 20 OFFSET ${offset} ORDER BY logtime DESC`;

  var r = await this.db.query(sql, [
    user_id
  ]);
  return r.rows;
};

point.prototype.update = function () {

};

point.prototype.count = async function (user_id) {
  var sql = 'SELECT COUNT(*) as total FROM point_log WHERE user_id=$1';
  var r = await this.db.query(sql, [user_id]);
  if (r.rowCount <= 0) {
    return 0;
  }
  return r.rows[0]['total'];
};
