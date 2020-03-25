module.exports = async (c, next) => {

  if (c.getFile('image') === null) {
    c.res.body = {
      status : 'BADDATA',
      errmsg : '没有发现上传文件，请在上传文件时使用upload name为image'
    };
    return ;
  }
  let f = c.getFile('image');

  if (f.size > 2097152) {
    c.res.body = {
      status : 'BADDATA',
      errmsg : '图片太大，超过2M(2097152 bytes)。'
    };
    return ;
  }

  if (f['content-type'] !== 'image/jpeg' && f['content-type'] !== 'image/png') {
    c.res.body = {
      status : 'BADDATA',
      errmsg : '图片格式错误，请上传.jpg或.png格式的图片。'
    };
    return ;
  }

  await next(c);
};
