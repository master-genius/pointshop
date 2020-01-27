process.chdir(__dirname);

const titbit = require('titbit');
const titloader = require('titbit-loader');
const pg = require('pg');
const gohttp = require('gohttp');
const cfg = require('config');
const cluster = require('cluster');
const dbcfg = require('./dbconfig.json');

var app = new titbit({
  debug : true,
});

if (cluster.isWorker) {

  app.service.config = cfg;
  app.service.db = new pg.Pool(dbcfg);
  app.service.http = gohttp;
  app.service.pagedir = __dirname + '/pages';

  var tld = new titloader();
  tld.init(app);
}

app.daemon(2020,'0.0.0.0', 2);
