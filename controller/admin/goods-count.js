class goodscount {
  constructor () {
    //this.param = '/';
    this.mode = 'callback';
  }

  async callback (c) {
    let kwd = c.query.kwd ? c.query.kwd.replace(/[;,\']+/ig, '') : '';
    c.res.body = {
      status : 'OK',
      data : await c.service.model.goods.count(kwd)
    };
  }


}

module.exports = goodscount;
