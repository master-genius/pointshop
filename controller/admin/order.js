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

  async put (c) {
    
  }

}

module.exports = order;
