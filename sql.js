const pg = require('pg');
const dbcfg = require('./dbconfig.json');

console.log(dbcfg);

var sqls = [
  //role : user | admin | root
  "create table if not exists users(id varchar(40) primary key, username varchar(50) not null default '', mobile varchar(16) not null default '', email varchar(50) not null default '', passwd varchar(255) not null default '', regtime timestamp not null, mobile_status smallint not null default 0, points integer not null default 0, login_time integer not null default 0, token text not null default '', openid varchar(80) not null default '', wxinfo text not null default '', role varchar(20) not null default 'user', outtime integer not null default 0)",

  //point_type : increase exchange recharge
  "create table if not exists point_log(id varchar(40) primary key, logtime timestamp not null, year int not null default 0, user_id varchar(40) references users(id), point_type varchar(20) not null default '', post_trash smallint not null default 0, trash_weight decimal(5,2) not null default 0, trash_type varchar(20) not null default 'common', admin_id varchar(40) not null default '', points integer not null default 0)",

  //"create table if not exists point_goods(id varchar(40) primary key, goods_name, point integer, )"

  //"create table if not exists trash_log (id varchar(40) primary key, logtime timestamp not null, year )"
];

var pgdb = new pg.Client(dbcfg);
pgdb.connect();

(async () => {
  for (let i=0; i<sqls.length; i++) {
    try {
      await pgdb.query(sqls[i]);
    } catch (err) {
      console.log(err);
    }
  }
  pgdb.end();
})();
