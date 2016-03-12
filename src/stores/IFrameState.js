
const Dispatcher = require('../dispatcher');
const _ = require('underscore');
const {CHANGE_EVENT} = require('../constants');
const EditorState = require('./EditorState');
const Base = require('./base');

const default_ = {
  url: ''
};

class IFrameState extends Base {
  constructor() {
    super();
    this.store_ = _.clone(default_);
  }
  dispatcherHandler_(action) {
    switch (action.type) {
    case 'locationChange':
      _.extend(this.store_, action.state);
      Dispatcher.waitFor([EditorState.dispatcherToken]);
      this.emit(CHANGE_EVENT, action.state);
      break;
    }
  }
}

module.exports = new IFrameState();
