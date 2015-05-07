
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var EditorState = require('./EditorState');
var Store = require('./index');



var store_ = {
  url: ''//http://www.yahoo.co.jp'
};

var IFrameState = assign({}, EventEmitter.prototype, {
  get() {
    return store_;
  }
}, require('./mixins_'));
module.exports = IFrameState;



IFrameState.dispatcherToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case 'locationChange':
      _.extend(store_, action.state);
      Dispatcher.waitFor([EditorState.dispatcherToken]);
      Store.emit(CHANGE_EVENT, action.state);
      break;
  }
});
