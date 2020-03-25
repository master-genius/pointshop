class image {
  constructor () {

  }

  /**
   * 
   * 图片上传到c.service.imagepath目录，但是此处并不关心目录是什么，
   * 这可以让你方便改动目录。
   */
  async post (c) {
    try {
      let r = await c.moveFile(c.getFile('image'), {
        path : c.service.imagepath
      });

      c. res.body = {
        status : 'OK',
        data : r.filename
      };
    } catch (err) {
      c.res.body = {
        status : 'FAILED',
        errmsg : `上传失败。(${err.message})`
      };
    }
  }

  async delete (c) {
    
  }

  __mid () {
    return [
      {
        name : 'imageFilter',
        path : ['post']
      }
    ];
  }

}

module.exports = image;
