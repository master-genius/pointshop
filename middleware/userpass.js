module.exports = async (c, next) => {
  var token = c.query.token || c.cookies['token'];

  if (token === undefined) {
    c.status(301);
    c.setHeader('Location', '/wx/oauth-code');
    return ;
  }
  
  var sql = 'SELECT id,openid,wxinfo,token,role,outtime FROM users WHERE token=$1';
  var r = await c.service.db.query(sql, [token]);
  if (r.rowCount <= 0 || r.rows[0].outtime <= parseInt(Date.now() / 1000 ) ) {
    c.status(301);
    c.setHeader('Location', '/wx/oauth-code');
    return ;
  }

  c.box.user = r.rows[0];

  await next(c);
};
