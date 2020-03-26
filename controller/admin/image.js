const fs = require('fs');

class image {
  constructor () {
    this.imageMap = {};
    this.images = [];
    this.imageCache = false;
  }

  getImageList (imgpath) {
    try {
      this.images = fs.readdirSync(imgpath);
      for (let i=0; i < this.images.length; i++) {
        this.imageMap[ images[i] ] = images[i];
      }
      this.imageCache = true;
    } catch (err) {
      console.log(err.message);
    }
  }

  async list (c) {
    if (!this.imageCache) {
      this.getImageList(c.service.imagepath);
    }

    c.res.body = {
      status : 'OK',
      data : this.imageList
    };
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
      
      this.images.unshift(r.filename);
      this.imageMap[r.filename] = r.filename;

      c.res.body = {
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
    try {
      fs.unlinkSync(c.service.imagepath + '/' + c.param.name);
      if (this.imageCache) {
        if (this.imageMap[c.param.name] !== undefined) {
          let ind = this.images.indexOf(c.param.name);
          this.images.splice(ind,1);
          delete this.imageMap[c.param.name];
        }
      }
      c.res.body = {
        status : 'OK',
        data : 'success'
      };
    } catch (err) {
      c.res.body = {
        status : 'FAILED',
        errmsg : err.message
      }
    }
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
