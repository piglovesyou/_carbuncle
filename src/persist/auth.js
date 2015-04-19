
var Q = require('q');
Q.longStackSupport = true;
var {MongoClient} = require('mongodb');
var _ = require('underscore');



module.exports = {
  connectDatabase,
  authenticate
};



var database = null;
var authenticated = false;
var lastState = getState();

function connectDatabase() {
  var state = getState();
  if (database && lastState.database === state.database) {
    return Q(database);
  } else {
    lastState = state;
    return Q.nfcall(MongoClient.connect, state.database, {'native_parser': true})
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
  var state = getState();
  if (database && authenticated && _.isEqual(lastState, state)) {
    return Q(database);
  } else {
    return connectDatabase()
    .then(db => {
      return Q.ninvoke(db, 'authenticate', state.username || '', state.password || '')
      .then(() => {
        authenticated = true;
        return database;
      })
      .catch(err => {
        authenticated = false;
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
