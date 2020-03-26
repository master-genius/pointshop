process.chdir(__dirname);

const titbit = require('titbit');
const titloader = require('titbit-loader');
const xmlparse = require('xml2js').parseString;
const wxmsg = require('./msghandle');
const pg = require('pg');
const gohttp = require('gohttp');
const cfg = require('./config/config');
const cluster = require('cluster');
const dbcfg = require('./dbconfig.json');
const crypto = require('crypto');
const porm = require('./psqlorm');
const fs = require('fs');

var app = new titbit({
  debug : true,
  timeout : 20000
});

app.service.imagepath = __dirname + '/goodsimages';
if (cluster.isMaster) {
  try {
    fs.accessSync(app.service.imagepath, fs.constants.F_OK);
  } catch (err) {
    fs.mkdirSync(app.service.imagepath);
  }
}

if (cluster.isWorker) {

  app.service.config = cfg;
  app.service.db = new pg.Pool(dbcfg);
  app.service.pgorm = function () {
    return new porm(app.service.db);
  };

  app.service.http = gohttp;
  app.service.pagedir = __dirname + '/pages';

  var tld = new titloader({
    mdb : app.service.pgorm
  });
  tld.init(app);
}

if (cluster.isWorker) {
  //用于验证过程，在公众号验证通过后则不会再使用。
  app.get('/wx/msg', async c => {
    var token = 'msgtalk';

    var urlargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();  //字典排序

    var onestr = urlargs.join(''); //拼接成字符串
    
  //生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
    
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
  });

  app.post('/wx/msg', async c => {
    try {
        let data = await new Promise((rv, rj) => {
            xmlparse(c.body, {explicitArray: false},
                (err, result) => {
                    if (err) { rj(err); }
                    else { rv(result.xml); }
                });
        });

        let retmsg = {
            touser : data.FromUserName,
            fromuser : data.ToUserName,
            msgtype : '',//为空，在处理时动态设置类型
            msgtime : parseInt(Date.now()/1000),
            msg : '',
            db : c.service.db
        };
        //交给消息派发函数进行处理
        //要把解析后的消息和要返回的数据对象传递过去
        c.res.body = await wxmsg.msgDispatch(data, retmsg);
    } catch (err) {
        console.log(err);
    }
  });
}

if (process.argv.indexOf('-d') > 0) {
  app.config.daemon = true;
  app.config.showLoadInfo = true;
}

app.daemon(2020,'localhost', 2);
