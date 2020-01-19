const titbit = require('titbit');
const titloader = require('titbit-loader');
const pg = require('pg');
const gohttp = require('gohttp');

var app = new titbit({
  debug : true,
});

var tld = new titloader();

tld.init(app);

app.run(8080);
