'use strict';

module.exports = async (c, next) => {
  if (c.routepath.indexOf('/user/order') == 0) {
    await next(c);
    return ;
  }
  let permdeny = {
    status : 'EPERMDENY',
    errmsg : 'deny'
  };
  /**
   * 只有admin和root用户才可以通过POST、PUT、DELETE请求更改数据
   */
  if (c.method !== 'GET') {
    if (c.box.user.role === 'user') {
      c.res.body = permdeny;
      return ;
    }
  }
  
  await next(c);
};
