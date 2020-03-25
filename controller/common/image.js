class image {
  constructor () {
    this.param = '/:name';

    //在目前的需求下，保证平均图片大小在200Kb，则大概可以缓存640张图片。
    //这基本上可以把全部图片缓存下来，完全可以满足很长一段时间的需求。
    //因为是Node.js运行环境，请不要把缓存数值设置太大，不要超过180,000,000。
    this.maxCacheSize = 135000000; // ~128MiB

    //通过缓存来增加获取速度
    this.imageCache = {};

    this.imageSize = 0;
  }

  async get (c) {
    c.res.encoding = 'binary';

    if (this.imageCache[c.param.name] !== undefined) {
      let img = this.imageCache[c.param.name];
      c.setHeader('content-type', img['content-type']);
      c.res.body = img.data;
      return ;
    }

    var imgfile = c.service.imagepath + '/' + c.param.name;

    var ctype = 'image/jpeg';
    if (imgfile.indexOf('.png') > 0 || imgfile.indexOf('.PNG') > 0) {
      ctype = 'image/png';
    }

    c.setHeader('content-type', ctype);

    try {
      c.res.body = await c.helper.readFile(imgfile, 'binary');

      //如果已经超过缓存大小则清空
      if (this.imageSize >= this.maxCacheSize) {
        this.imageCache = {};
        this.imageSize = 0;
      }

      this.imageCache[c.param.name] = {
        size : c.res.body.length,
        data : c.res.body,
        'content-type' : ctype
      };
      this.imageSize += c.res.body.length;
      c.setHeader('content-length', c.res.body.length);
    } catch (err) {
      console.log(err);
      c.status(404);
    }
  }

}

module.exports = image;
