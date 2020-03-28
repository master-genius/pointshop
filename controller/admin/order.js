class order {
  constructor () {
    
  }

  async get (c) {

  }

  async list (c) {
    var tm = new Date();
    var year = tm.getFullYear();
    var month = tm.getMonth() + 1;

    if (c.query.year) {
      year = c.query.year;
    }
    if (c.query.month) {
      month = c.query.month;
    }
    let olist = await c.service.model.order.list(year, month);
    c.res.body = {
      status : 'OK',
      data : olist
    };
  }

  async post (c) {

  }

  async delete (c) {

  }

  //目前PUT请求用于确认订单,
  //如果要扩展更新订单的功能，则需要修改此函数，通过body中提交JSON数据，使用action字段来区分具体操作。
  //在此类中创建其他函数用来处理不同类型的操作。
  async put (c) {
    c.res.body = await c.service.model.order.confirm(c.param.id);

  }

}

module.exports = order;
