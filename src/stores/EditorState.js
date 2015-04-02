
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var CHANGE_EVENT = 'change';



var _store = {
  title: '',
  css: '',
  id: '',
  mode: 'action',
  type: 'click'
};

var EditorState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = EditorState;



Dispatcher.register(function(action) {
  switch (action.type) {
    case 'editorChange':
      _.extend(_store, action.state);
      EditorState.emit(CHANGE_EVENT);
      break;
  }
});
