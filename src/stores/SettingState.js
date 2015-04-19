
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Auth = require('../persist/auth');
// var Q = require('q');
var _ = require('underscore');
var {CHANGE_EVENT, MongoErrorCode} = require('../constants');



var _store = {
  databaseConnected: null,
  authenticated: null
};

var SettingState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  },
  authenticate
}, require('./_mixins'));
module.exports = SettingState;



SettingState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'changeSetting':
      _.extend(window.localStorage, action.form);
      authenticate();
      break;
  }
});



function authenticate() {
  Auth.authenticate()
  .then(() => {
    _store.databaseConnected = true;
    _store.authenticated = true;
    return SettingState.emit(CHANGE_EVENT);
  })
  .catch(err => {
    if (!err.code) {
      _store.databaseConnected = false;
      _store.authenticated = false;
      return SettingState.emit(CHANGE_EVENT);
    } else if (err.code === MongoErrorCode.AUTH_FAILED) {
      _store.databaseConnected = true;
      _store.authenticated = false;
      return SettingState.emit(CHANGE_EVENT);
    }
    throw new Error('catch this!', err);
  });
}
