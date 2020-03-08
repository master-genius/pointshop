'use strict';

const crypto = require('crypto');

var order = function (db) {

  if (!(this instanceof order)) {
    return new order(db);
  }

  this.db = db;

  this.makeId = (cstr = '') => {
    var h = crypto.createHash('sha1');
    h.update(`${cstr}${Math.random()}${Date.now()}`);
    return h.digest('hex');
  };



};

order.prototype.insert = function (user_id, data) {

};


order.prototype.update = function (user_id, data) {

};


