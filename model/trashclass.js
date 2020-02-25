'use strict';

var trashclass = function (db) {
  if (!(this instanceof trashclass)) {
    return new trashclass(db);
  }

  this.db = db;

  this.table = function () {
    return this.db.table('trash_class');
  };

  this.makeId = (cstr = '') => {
    var h = crypto.createHash('sha1');
    h.update(`${cstr}${Math.random()}${Date.now()}`);
    return h.digest('hex');
  };
};

trashclass.prototype.getList = async function () {
  return await this.db.select('id,tname');
};

trashclass.prototype.getSubClass = async function (id) {
  return await this.db.table('trash_point')
        .where('trash_class_id=?', [id])
        .select('id,tname,cash,point,weight');
};
