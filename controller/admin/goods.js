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

  async post (c) {
    try {
      let data = JSON.parse(c.body);
      let r = await c.service.model.goods.add(data);
      if (r === false) {
        c.res.body = {
          status : 'FAILED',
          errmsg : '创建失败。请稍候再试。'
        };
      } else {
        c.res.body = {
          status : 'OK',
          data : r
        };
      }
    } catch (err) {
      c.res.body = {
        status : 'BADDATA',
        errmsg : err.message
      };
    }
  }

  async put (c) {

  }

  async delete (c) {

  }

  async list (c) {
    let page = c.query.page ? c.query.page : 1;
    let kwd = c.query.kwd ? c.query.kwd : '';
    c.res.body = {
      status : 'OK',
      data : await c.service.model.goods.list(page, kwd)
    };
  }

}

module.exports = goods;
