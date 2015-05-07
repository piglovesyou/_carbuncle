
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Auth = require('../persist/auth');
var _ = require('underscore');
var {CHANGE_EVENT, MongoErrorCode} = require('../constants');

var default_ = {
  databaseConnected: null,
  authenticated: null
};



class SettingState extends EventEmitter {
  constructor() {
    super();
    this.store_ = _.clone(default_);
    this.dispatcherToken = Dispatcher.register(this.dispatcherHandler_.bind(this));
  }
  get() {
    return this.store_;
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  dispatcherHandler_(action) {
    switch (action.type) {
      case 'changeSetting':
        _.extend(window.localStorage, action.form);
        authenticate();
        break;
    }
  }
  authenticate() {
    Auth.authenticate()
    .then(() => {
      this.store_.databaseConnected = true;
      this.store_.authenticated = true;
      return this.emit(CHANGE_EVENT);
    })
    .catch(err => {
      if (!err.code) {
        this.store_.databaseConnected = false;
        this.store_.authenticated = false;
        return this.emit(CHANGE_EVENT);
      } else if (err.code === MongoErrorCode.AUTH_FAILED) {
        this.store_.databaseConnected = true;
        this.store_.authenticated = false;
        return this.emit(CHANGE_EVENT);
      }
      throw new Error('catch this!', err);
    });
  }
}

module.exports = new SettingState();
