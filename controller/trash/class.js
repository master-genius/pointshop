'use strict';

class trashclass {
  constructor () {
    
  }

  async get (c) {
    //let r = await c.service.
    try {
      var r = await c.service.model.trashclass.getSubClass(c.param.id);
      c.res.body = {
        status : 'OK',
        data : r.rows
      };
    } catch (err) {
      c.res.body = {
        status : 'EFAILED',
        errmsg : '获取子类失败'
      };
    }
  }

  async list (c) {
    try {
      var r = await c.service.model.trashclass.getList();
      c.res.body = {
        status : "OK",
        data : r.rows
      };
    } catch (err) {
      console.log(err);
      c.res.body = {
        status : "EFAILED",
        errmsg : "获取类型失败"
      };
    }
  }
}

module.exports = trashclass;
