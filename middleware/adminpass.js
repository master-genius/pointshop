module.exports = async (c, next) => {
  if (c.query.token === undefined || c.query.token !== 'wangyuan2020!') {
    c.res.body = {
      status : 'EPERMDENY',
      errmsg : 'deny'
    };
    return ;
  }

  await next(c);
};
