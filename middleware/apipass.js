module.exports = async (c, next) => {
  if (c.query.token === undefined) {
    c.res.body = {
      status : 'EPERMDENY',
      errmsg : 'deny.'
    };
    return ;
  }

  var token = c.query.token;
  var sql = 'SELECT id,openid,wxinfo,token,login_time,role,outtime FROM users WHERE token=$1';
  var r = await c.service.db.query(sql, [token]);
  if (r.rowCount <= 0 || r.rows[0].outtime <= parseInt(Date.now() / 1000 ) ) {
    c.res.body = {
      status : 'EPERMDENY',
      errmsg : 'deny!'
    };
    return ;
  }

  c.box.user = r.rows[0];

  await next(c);
};
