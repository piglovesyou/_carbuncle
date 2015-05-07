
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var EditorState = require('./EditorState');
var Store = require('./index');
var Base = require('./base');

var default_ = {
  url: ''
};

class IFrameState extends Base {
  constructor() {
    super();
    this.store_ = _.clone(default_);
  }
  dispatcherHandler_(action) {
    switch(action.type) {
      case 'locationChange':
        _.extend(this.store_, action.state);
        Dispatcher.waitFor([EditorState.dispatcherToken]);
        this.emit(CHANGE_EVENT, action.state);
        break;
    }
  }
}

module.exports = new IFrameState();
