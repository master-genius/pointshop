const formatMsg = require('./fmtwxmsg');

function help () {
  let helpinfo = '这是道简网络科技服务号，关注技术和生活，通过技术、思考、吸纳、整理，提供综合性信息服务。\n';
  helpinfo += '合作可以发送邮件到管理员邮箱：1146040444@qq.com';
  return helpinfo;
}

/*
 * @param {object} wxmsg 解析XML消息的对象
 * @param {object} retmsg 要返回的数据对象
 * */
function userMsg (wxmsg, retmsg) {
    //关键字自动回复
    if (wxmsg.MsgType == 'text') {
        switch (wxmsg.Content) {
            case '帮助':
            case 'help':
            case '?':
            case 'about':
            case 'aboutus':
                retmsg.msg = help();
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
            default:
              return '';
        }
    }
    //处理其他类型的消息
    switch (wxmsg.MsgType) {
        case 'image':
        case 'voice':
            retmsg.msgtype = wxmsg.MsgType;
            retmsg.msg = wxmsg.MediaId;
            return formatMsg(retmsg);
        default:
          //retmsg.msgtype类型为空，
          //格式化数据会返回default处的数据
          //提示用户该类型不被支持。
          return formatMsg(retmsg);
    }
}

function clickHandle (wxmsg, retmsg) {
    switch (wxmsg.EventKey) {
        case 'help':
        case 'aboutus':
          retmsg.msgtype = 'text';
          retmsg.msg = help();
          return formatMsg(retmsg);
        case 'register':
          return logSubUser(wxmsg, retmsg.db, retmsg);
    }
    return '';
}

async function logSubUser(wxmsg, db, retmsg) {
  var usql = `SELECT openid FROM users WHERE openid=$1`;
  var r = await db.query(usql, [wxmsg.FromUserName]);
  retmsg.msgtype = 'text';

  if (r.rowCount > 0) {
    retmsg.msg = '用户已存在';
    return formatMsg(retmsg);
  }

  var sql = 'INSERT INTO users(id, openid, regtime) VALUES ($1, $2, $3)';
  var dt = new Date();

  r = await db.query(sql, [
    `${wxmsg.FromUserName.substring(0, 8)}${Date.now()}`,
    wxmsg.FromUserName,
    `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
  ]);

  if (r.rowCount <= 0) {
    retmsg.msg = '注册失败，请稍后再试';
    return formatMsg(retmsg);
  }

  retmsg.msg = '注册成功';
  return formatMsg(retmsg);
}

function eventMsg(wxmsg, retmsg) {
  //默认让返回消息类型为文本
  retmsg.msgtype = 'text';

  switch (wxmsg.Event) {
    case 'subscribe':
      logSubUser(wxmsg, retmsg.dbpool);
      retmsg.msg = '你好，我们提供了网站、小程序、公众号等多个途径提供综合性信息服务。';
      return formatMsg(retmsg);
    case 'unsubscribe':
      unSubUser(wxmsg, retmsg.dbpool);
      break;
    case 'VIEW':
      break;
    case 'CLICK':
      return clickHandle(wxmsg, retmsg);
    default:
      return '';
  }
  return '';
}

//后续还会加入事件消息支持
exports.msgDispatch = function(wxmsg, retmsg) {
  if (wxmsg.MsgType == 'event') {
    return eventMsg(wxmsg, retmsg);
  }
  return userMsg(wxmsg, retmsg);
};
