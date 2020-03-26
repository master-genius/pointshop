
class admin {
  constructor () {
    this.param = '/wang-yuan-de-hou-tai';
    this.pageData = '';
  }

  async get (c) {
    if (this.pageData === '') {
      this.pageData = await c.helper.readFile(c.service.pagedir + '/admin.html');
    }

    c.res.body = this.pageData;
  }

}

module.exports = admin;
