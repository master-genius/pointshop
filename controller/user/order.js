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
      c.res.body = await c.service.model.user_order.cancel(c.box.user.id, c.param.id);
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

    let uord = c.service.model.user_order;

    let ord = uord.get(user_id, order_id);

    if (ord === null) {
      c.res.body = {
        status : 'FAILED',
        errmsg : '获取订单失败'
      };

      return ;
    }
    
    c.res.body = {
      status : 'OK',
      data : ord
    };
  }

  /**
   * 
   * data 是json格式：
   *  {
   *     "goods_id" : GOODS_ID,
   *     "number"   : NUMBER
   *  }
   */
  async post (c) {
    try {
      let data = JSON.parse(c.body);
      if (data.goods_id === undefined 
        || data.number === undefined 
        || isNaN(data.number)
      ) {
        c.res.body = {
          status : 'BADDATA',
          errmsg : '数据格式错误或者缺少相关字段。'
        };
        return ;
      }
      
      let uord = c.service.model.user_order;
      let r = await uord.insert(c.box.user.id, data.goods_id, data.number);

      c.res.body = r;

    } catch (err) {
      console.log(err);
      c.res.body = {
        status : 'BADDATA',
        errmsg : `数据格式错误。(${err.message})`
      }
    }
  }

  async delete (c) {

  }

}

module.exports = order;
