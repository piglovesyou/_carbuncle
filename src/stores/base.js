
const Dispatcher = require('../dispatcher');
const EventEmitter = require('events').EventEmitter;
const {CHANGE_EVENT} = require('../constants');
const assert = require('assert');

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
