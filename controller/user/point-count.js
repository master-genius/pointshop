class pcount {

  constructor () {
    this.param = '/';
  }

  async get (c) {
    try {
      var total = await c.service.model.point.count(c.box.user.id);
      c.res.body = {
        status : 'OK',
        data : total
      };
    } catch (err) {
      c.res.body = {
        status : 'EFAILED',
        errmsg : 'Error: 暂时无法获取总数'
      };
    }
  }

}

module.exports = pcount;
