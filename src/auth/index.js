
var Q = require('q');
Q.longStackSupport = true;
var {MongoClient} = require('mongodb');



module.exports = {
  connectDatabase,
  authenticate
};



var _store = global.window.localStorage;

var database = null;
var lastDatabaseUri = null;
function connectDatabase() {
  if (database && lastDatabaseUri === _store.database) {
    return Q(database);
  } else {
    lastDatabaseUri = _store.database;
    return Q.nfcall(MongoClient.connect, _store.database, {'native_parser': true, options: { w: 1 }})
    .then(d => {
      console.log('Newly connected to a database');
      database = d;
      d.once('close', () => {
        console.log('Closeing...');
        database = null;
      });
      return d;
    });
  }
}

function authenticate() {
  return connectDatabase()
  .then(db => {
    return Q.ninvoke(db,
        'authenticate',
        _store.username || '',
        _store.password || '');
  });
}
