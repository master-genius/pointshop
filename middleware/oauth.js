module.exports = async (c, next) => {
  let r = await c.service.db.query('SELECT id,token,openid,wxinfo,role,login_time FROM users');
};
