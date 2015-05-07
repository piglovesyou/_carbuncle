
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Auth = require('../persist/auth');
var _ = require('underscore');
var {CHANGE_EVENT, MongoErrorCode} = require('../constants');
var assert = require('assert');

class Base extends EventEmitter {
  constructor() {
    super();
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
    assert.fail('implement!');
  }
}

module.exports = Base;
