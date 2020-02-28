const pg = require('pg');
const dbcfg = require('./dbconfig.json');
const psqlorm = require('psqlorm');


var pgdb = new pg.Client(dbcfg);
pgdb.connect();
var porm = new psqlorm(pgdb);

var testOuttime = parseInt(Date.now() / 1000) + 157680000;

var test_users = [
  {
    id : 'test_101',
    username : 'TestA',
    openid : 'test_101_wx',
    role : 'user',
    regtime : '2020-02-28',
    token : 'test101a20200228',
    outtime : testOuttime
  },

  {
    id : 'test_102',
    username : 'TestB',
    openid : 'test_101_wx',
    role : 'user',
    regtime : '2020-02-28',
    token : 'test102b20200228',
    outtime : testOuttime
  },

  {
    id : 'test_admin',
    username : 'TestAdmin',
    openid : 'test_admin_wx',
    role : 'admin',
    regtime : '2020-02-28',
    token : 'testadmina20200228',
    outtime : testOuttime
  }
  
];

(async () => {
  var r = null;
  for (let i=0; i<test_users.length; i++) {
    try {
      console.log(`创建用户{ id : ${test_users[i].id}, `
            +`openid : ${test_users[i].openid}, role : ${test_users[i].role}, `
            + `token : ${test_users[i].token}}`
          );
      r = await porm.table('users').where('id=?', [test_users[i].id]).select('*');
      if (r.rowCount <= 0) {
        await porm.table('users').insert(test_users[i]);
      } else {
        console.log('用户已存在');
      }
    } catch(err) {
      console.log(err);
    }
  }

  console.log('可使用给出的测试用户和token进行测试，无需考虑token是否失效。');

  pgdb.end();
})();
