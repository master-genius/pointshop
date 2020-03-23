class order {

  constructor () {

  }

  async list (c) {
    let user_id = c.box.user.id;
    let morder = c.service.model.user_order;
    let page = c.query.page ? c.query.page : 1;
    let olist = morder.orderList(user_id, page);
    c.res.body = {
      status : 'OK',
      data : olist
    };
  }

  /**
   * body提交:
   *   {
   *     "action" : "cancel"
   *   }
   * 
   */
  async put (c) {
    try {
      let d = JSON.parse(c.body);
      if (d.action === undefined || d.action !== 'cancel') {
        c.res.body = {
          status : 'BADDATA',
          errmsg : '数据格式错误。'
        };
        return ;
      }
      let r = await c.service.model.user_order.cancel(c.box.user.id, c.param.id);
      return r;
    } catch (err) {
      c.res.body = {
        status : 'FAILED',
        errmsg : '更新失败，请检测数据是否正确。'
      };
    }
  }

  async get (c) {
    let user_id = c.box.user.id;
    let order_id = c.param.id;

    

  }

  async post (c) {

  }

  async delete (c) {

  }

}

module.exports = order;
