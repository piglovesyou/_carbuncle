
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');

var DEFAULT_STATE = {
  title: '',
  css: '',
  id: '',
  mode: 'action',
  type: 'click',
  text: '',
  isEdit: false
};

var _store = goog.object.clone(DEFAULT_STATE);

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
        type: 'open',
        text: action.state.url
      });
      EditorState.emit(CHANGE_EVENT);
      break;

    case 'editorChange':
      _.extend(_store, action.state);
      EditorState.emit(CHANGE_EVENT, {editorState: action.state});
      break;

    case 'selectIFrameElement':
      _store.title = action.selectedIframeElementData.title;
      _store.css = action.selectedIframeElementData.css;
      _store.mode = action.selectedIframeElementData.mode;
      if (_store.type !== 'click' || _store.type !== 'input') {
        _store.type = 'click';
      }
      EditorState.emit(CHANGE_EVENT);
      break;

    case 'insertEntry':
      _.extend(_store, DEFAULT_STATE);
      EditorState.emit(CHANGE_EVENT);
      break;

    case 'startEditEntry':
      _.extend(_store, DEFAULT_STATE, action.entry, {
        isEdit: true
      });
      EditorState.emit(CHANGE_EVENT);
      break;
  }
});
