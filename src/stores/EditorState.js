
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



EditorState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'locationSubmit':
      _.extend(_store, {
        css: '',
        mode: 'action',
        type: 'open'
      });
      EditorState.emit(CHANGE_EVENT);
      break;
    case 'editorChange':
      _.extend(_store, action.state);
      EditorState.emit(CHANGE_EVENT, {editorState: action.state});
      break;
  }
});
