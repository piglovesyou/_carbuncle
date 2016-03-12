
const Q = require('q');
Q.longStackSupport = true;
const {MongoClient} = require('mongodb');
const _ = require('underscore');
const Actions = require('../actions');


module.exports = {
  connectDatabase,
  authenticate,
  getDB
};


let database = null;
let authenticated = false;
let lastState = getState();

function getDB() {
  return authenticate();
}

function connectDatabase() {
  const state = getState();
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
  const state = getState();
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
        console.log(err.stack);
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
