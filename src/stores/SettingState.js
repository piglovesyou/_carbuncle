const Auth = require('../persist/auth');
const _ = require('underscore');
const {CHANGE_EVENT, MongoErrorCode} = require('../constants');
const Base = require('./base');

const default_ = {
  databaseConnected: null,
  authenticated: null
};

class SettingState extends Base {
  constructor() {
    super();
    this.store_ = _.clone(default_);
  }
  dispatcherHandler_(action) {
    switch (action.type) {
    case 'changeSetting':
      _.extend(window.localStorage, action.form);
      this.authenticate();
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
