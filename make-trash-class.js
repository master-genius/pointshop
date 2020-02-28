const pg = require('pg');
const dbcfg = require('./dbconfig.json');
const psqlorm = require('psqlorm');
const tclass = require('./trash-class');

var pgdb = new pg.Client(dbcfg);
pgdb.connect();
var porm = new psqlorm(pgdb);

var ptopclass = [];
var subclass = [];

var tmp = '';
var subtmp = '';
for (let k in tclass) {
  tmp = k.split('@');
  ptopclass.push({
    tname : tmp[0],
    id : tmp[1]
  });

  for (let t in tclass[k]) {
    subtmp = t.split('@');
    subclass.push({
      id : subtmp[1],
      tname : subtmp[0],
      trash_class_id : tmp[1],
      cash : tclass[k][t][0],
      point : tclass[k][t][1]
    });
  }
}

(async () => {

  try {
    await pgdb.query('DELETE FROM trash_class;');
    await pgdb.query('DELETE FROM trash_point;');

    await porm.table('trash_class').insertAll(ptopclass);
    await porm.table('trash_point').insertAll(subclass);
  } catch (err) {
    console.log(err);
  }
  console.log('OK');
  pgdb.end();
})();
