class ordercount {
  constructor () {
    this.mode = 'callback';
  }

  async callback (c) {
    c.res.body = {
      status : "OK",
      data : await c.service.mode.user_order.count(c.box.user.id)
    };
  }

}

module.exports = ordercount;
