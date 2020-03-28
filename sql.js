const pg = require('pg');
const dbcfg = require('./dbconfig.json');

console.log(dbcfg);

var sqls = [
  //role : user | admin | root
  "create table if not exists users(id varchar(40) primary key, username varchar(50) not null default '', mobile varchar(16) not null default '', email varchar(50) not null default '', passwd varchar(255) not null default '', regtime timestamp not null, mobile_status smallint not null default 0, points integer not null default 0, frozen_points integer not null default 0, login_time integer not null default 0, token text not null default '', openid varchar(80) not null default '', wxinfo text not null default '', role varchar(20) not null default 'user', outtime integer not null default 0)",

  //point_type : increase exchange recharge
  "create table if not exists point_log(id varchar(40) primary key, logtime timestamp not null, year int not null default 0, openid varchar(80) not null default '', point_type varchar(20) not null default '', post_trash smallint not null default 0, trash_weight decimal(5,2) not null default 0, trash_type varchar(20) not null default 'common', admin_id varchar(40) not null default '', points integer not null default 0, verify_code varchar(40) not null default '', code_time integer not null default 0, code_status smallint not null default 0)",

  "create table if not exists trash_class(id varchar(40) primary key, tname varchar(30) not null default '')",

  "create table if not exists trash_point(id varchar(40) primary key, trash_class_id varchar(40) not null default '', tname varchar(30) not null default '', weight decimal(5,2) not null default 1, point integer not null default 1, cash decimal(5,2) not null default 0.01)",

  "create table if not exists trash_goods (id varchar(40) primary key, goods_name varchar(100) not null default '', points integer not null default 0, goods_image text not null default '', storage integer not null default 0, detail text not null default '')",

  //订单积分状态，0：未完成，1：已完成，2：取消
  "create table if not exists point_order(id varchar(40) primary key, user_id varchar(40) not null default '', order_time varchar(20) not null default '', timeint bigint not null default 0, order_status smallint not null default 0, goods_id varchar(40) not null default '', points integer not null default 0, number integer not null default 1, year integer not null default 0)"

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
