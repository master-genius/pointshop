class user {

  constructor () {
    this.param = '/';
  }

  async get (c) {
    var pagedata = await c.helper.readFile(c.service.pagedir+'/user.html');
    c.send(pagedata);
  }

}

module.exports = user;
