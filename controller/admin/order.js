class order {
  constructor () {
    
  }

  async get (c) {

  }

  async list (c) {
    if (!c.query.page || isNaN(c.query.page) || c.query.page < 0){
      c.query.page = 1;
    }
    let cond = {};
    if (c.query.user_id) {
      cond.user_id = c.query.user_id;
    }
    if (c.query.year) {
      cond.year = c.query.year;
    }
    let olist = await c.service.model.order.list(c.query.page, cond);
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
