const admd = require('../data/admin.json');
const crypto = require('crypto');

class admin {
  constructor (db) {

  }

  hashPasswd (cstr) {
    var h = crypto.createHash('sha512');
    h.update(cstr);
    return h.digest('hex');
  }

  login (username, passwd) {
    if (admd[username] === undefined) {
      return false;
    }

    if (this.hashPasswd(passwd) === admd[username].passwd) {
      return {
        id : admd[username].id,
        username : username
      };
    }

    return false;
  }

}

module.exports = admin;
