class order {
  constructor () {
    
  }

  async get (c) {

  }

  async list (c) {
    let olist = await c.service.model.order.list(c.query);
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
