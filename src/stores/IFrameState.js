
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var CHANGE_EVENT = 'change';
var EditorState = require('./EditorState');
var Store = require('./index');



var _store = {
  url: 'http://www.yahoo.co.jp'
};

var IFrameState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = IFrameState;



IFrameState.dispatcherToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case 'locationSubmit':
      _.extend(_store, action.state);
      Dispatcher.waitFor([EditorState.dispatcherToken]);
      Store.emit(CHANGE_EVENT, action.state);
      break;
  }
});
