
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Auth = require('../persist/auth');
// var Q = require('q');
var _ = require('underscore');
var {CHANGE_EVENT, MongoErrorCode} = require('../constants');



var store_ = {
  databaseConnected: null,
  authenticated: null
};

var SettingState = assign({}, EventEmitter.prototype, {
  get() {
    return store_;
  },
  authenticate
}, require('./mixins_'));
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
    store_.databaseConnected = true;
    store_.authenticated = true;
    return SettingState.emit(CHANGE_EVENT);
  })
  .catch(err => {
    if (!err.code) {
      store_.databaseConnected = false;
      store_.authenticated = false;
      return SettingState.emit(CHANGE_EVENT);
    } else if (err.code === MongoErrorCode.AUTH_FAILED) {
      store_.databaseConnected = true;
      store_.authenticated = false;
      return SettingState.emit(CHANGE_EVENT);
    }
    throw new Error('catch this!', err);
  });
}
