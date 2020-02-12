class point {

  constructor () {

  }

  async list (c) {
    try {
      let offset = c.query.offset || 0;
      if (isNaN(offset) || offset < 0) {
        offset = 0;
      }
      let year = c.query.year || (new Date()).getFullYear();
      if (isNaN(year) || year <= 0) {
        year = (new Date()).getFullYear();
      }
      c.res.body = {
        status : 'OK',
        data : await c.service.model.point.list(c.box.user.id, offset, year)
      };
    } catch (err) {
      c.res.body = {
        status : 'EFAILED',
        errmsg : '请求失败，请稍后再试'
      };

    }
  }

  async get (c) {

  }

  async post (c) {
    try {
      console.log(c.body);
      let pdata = JSON.parse(c.body);
      let r = await c.service.model.point.insert(c.box.user.id,c.box.user.id, pdata);
      if (r === false) {
        c.res.body = {
          status : 'EFAILED',
          errmsg : '请求处理失败，请检查数据是否正确'
        };
      } else {
        c.res.body = {
          status : 'OK',
          data : r
        };
      }
    } catch (err) {
      console.log(err);
      c.res.body = {
        status : 'EBADDATA',
        errmsg : '数据错误'
      };
    }
  }

  async put (c) {

  }

}

module.exports = point;
