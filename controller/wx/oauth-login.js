class oauthlogin {

  constructor () {
    this.param = '/';
    this.update_sql = 'UPDATE users set token=$1,outtime=$2,wxinfo=$3 WHERE openid=$4';
  }

  makeToken (openid, hash) {
    return hash(`${Math.random()}${openid}${Date.now()}`);
  }

  outtime () {
    return parseInt(Date.now()/1000) + 36000;
  }

  setCookie(ck, c) {
    return encodeURIComponent(`token=${ck.token};nickname=${ck.nickname};Path=/;`
      +`Expires=${(new Date(Date.now() + 3600000)).toString()};`
      +`Domain=${c.service.config.domain}`);
  }

  async get (c) {

    var code = c.query.code;
    var token_url = `https://api.weixin.qq.com/sns/oauth2/access_token`
      + `?appid=${c.service.config.appid}&secret=${c.service.config.secret}&code=${code}`
      + `&grant_type=authorization_code`;

    var t = await c.service.http.get(token_url, {encoding:'utf8'});
    t = JSON.parse(t);

    if (t.access_token === undefined) {
      c.status(500);
      c.send('Error: 网络错误请稍后再试');
      return ;
    }

    var userinfo_url = `https://api.weixin.qq.com/sns/userinfo`
      + `?access_token=${t.access_token}&openid=${t.openid}&lang=zh_CN`;

    var u = await c.service.http.get(userinfo_url, {encoding:'utf8'});
    var wxuser = JSON.parse(u);
    var token = this.makeToken(t.openid, c.helper.sha1);
    let r = await c.service.db.query(this.update_sql, [
      token, this.outtime(), u, t.openid
    ]);

    if (r.rowCount <= 0) {
      c.status(500);
      c.send('Error: 授权登录出错，请稍后再试或联系管理员。');
      return ;
    }

    c.setHeader('Set-Cookie', this.setCookie({
      nickname : wxuser.nickname,
      token : token
    }, c));
    //c.setHeader('Location', '/page/user');
    //c.status(301);
    c.send(await c.helper.readFile(c.service.pagedir+'/login.html'));
  }

}

module.exports = oauthlogin;
