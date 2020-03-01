process.chdir(__dirname);

const titbit = require('titbit');
const gohttp = require('gohttp');
const cfg = require('./config/config');
const cluster = require('cluster');
const dbcfg = require('./dbconfig.json');
const crypto = require('crypto');

var app = new titbit({
  debug : true,
});

if (cluster.isWorker) {
  app.get('/access-token', async c => {

  });
}



app.daemon(3456, 'localhost', 1);
