
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var CHANGE_EVENT = 'change';



var _store = {
  url: 'http://www.yahoo.co.jp'
};

var IFrameState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = IFrameState;



Dispatcher.register(function(action) {
  switch (action.type) {
    case 'editorChange':
      _.extend(_store, action.state);
      IFrameState.emit(CHANGE_EVENT);
      break;
  }
});
