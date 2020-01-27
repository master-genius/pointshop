class oauthcode {

  constructor () {

  }

  formatCodeUrl (appid, redirect, state) {
    return `https://open.weixin.qq.com/connect/oauth2/authorize`
      + `?appid=${appid}&redirect_uri=${redirect}&response_type=code`
      + `&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
  }

  async get (c) {
    c.setHeader('Location', 
      this.formatCodeUrl(c.service.config.appid, 
            c.service.config.redirect,
            'code'
          )
    );
    c.status(301);
  }

}

module.exports = oauthcode;
