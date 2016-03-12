
var Q = require('q');
Q.longStackSupport = true;
var {MongoClient} = require('mongodb');
var _ = require('underscore');
var Actions = require('../actions');



module.exports = {
  connectDatabase,
  authenticate,
  getDB
};



var database = null;
var authenticated = false;
var lastState = getState();

function getDB() {
  return authenticate();
}

function connectDatabase() {
  var state = getState();
  if (database && lastState.database === state.database) {
    return Q(database);
  } else {
    lastState = state;
    return Q.nfcall(MongoClient.connect, state.database, {'native_parser': true})
    .then(d => {
      console.info('Newly connected to a database');
      database = d;
      d.once('close', () => {
        console.info('Closeing connection...');
        database = null;
      });
      Actions.notify({ active: false });
      return d;
    })
    .catch(err => {
      Actions.notify({
        type: 'danger',
        icon: 'unlink',
        message: 'データベースが見つかりません'
      });
      throw err;
    });
  }
}

function authenticate() {
  var state = getState();
  if (database && authenticated && _.isEqual(lastState, state)) {
    return Q(database);
  } else {
    return connectDatabase()
    .then(db => {
      return Q.ninvoke(db, 'authenticate', state.username || '', state.password || '')
      .then(() => {
        authenticated = true;
        Actions.notify({ active: false });
        return database;
      })
      .catch(err => {
        console.log(err.stack)
        authenticated = false;
        Actions.notify({
          type: 'danger',
          icon: 'user-times',
          message: 'ユーザー認証に失敗しました'
        });
        throw err;
      });
    });
  }
}

function getState() {
  return {
    database: global.window.localStorage.database,
    username: global.window.localStorage.username,
    password: global.window.localStorage.password
  };
}
