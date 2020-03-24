class goods {
  constructor () {

  }

  async get (c) {
    let g = await c.service.model.goods.get(c.param.id);
    if (g === null) {
      c.res.body = {
        status : 'FAILED',
        errmsg : '没有发现商品。'
      };
      return ;
    }
    c.res.body = {
      status : 'OK',
      data : g
    };
  }

  async list (c) {
    let page = c.query.page ? c.query.page : 1;
    let kwd = c.query.kwd ? c.query.kwd : '';
    c.res.body = {
      status : 'OK',
      data : await c.service.model.goods.goodsList(page, kwd)
    }
  }

}

module.exports = goods;
