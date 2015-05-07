
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var EditorState = require('./EditorState');
var Store = require('./index');

var default_ = {
  url: ''
};



class IFrameState extends EventEmitter {
  constructor() {
    super();
    this.store_ = _.clone(default_);
    this.dispatcherToken = Dispatcher.register(this.dispatcherHandler_.bind(this));
  }
  get() {
    return this.store_;
  }
  dispatcherHandler_(action) {
    switch(action.type) {
      case 'locationChange':
        _.extend(store_, action.state);
        Dispatcher.waitFor([EditorState.dispatcherToken]);
        Store.emit(CHANGE_EVENT, action.state);
        break;
    }
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

module.exports = new IFrameState();
