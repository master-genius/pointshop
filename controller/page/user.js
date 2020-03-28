class user {

  constructor () {
    this.param = '';
  }

  async get (c) {
    c.res.body = await c.helper.readFile(c.service.pagedir+'/user.html');
  }

}

module.exports = user;
