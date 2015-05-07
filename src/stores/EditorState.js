
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

var store_ = goog.object.clone(DEFAULT_STATE);

var EditorState = assign({}, EventEmitter.prototype, {
  get() {
    return store_;
  }
}, require('./mixins_'));
module.exports = EditorState;



EditorState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'locationChange':
      store_ = _.extend({}, DEFAULT_STATE, {
        title: action.state.title,
        mode: 'action',
        type: 'open',
        text: action.state.url
      });
      EditorState.emit(CHANGE_EVENT);
      break;

    case 'editorChange':
      _.extend(store_, action.state);
      EditorState.emit(CHANGE_EVENT, {editorState: action.state});
      break;

    case 'iframeScroll':
      EditorState.emit(CHANGE_EVENT, {editorState: EditorState.get()});
      break;

    case 'selectIFrameElement':
      var elementRef = action.selectedIframeElementData.elementRef;
      delete action.selectedIframeElementData.elementRef;
      _.extend(store_, action.selectedIframeElementData);
      if (store_.mode === 'action' && (store_.type !== 'click' || store_.type !== 'input')) {
        store_.type = candidateType(elementRef);
      }
      store_.text = '';
      EditorState.emit(CHANGE_EVENT);
      break;

    case 'deleteEntry':
      if (store_.id === action.id) {
        restore();
      }
      break;

    case 'editEntry':
    case 'cancelEdit':
    case 'insertEntry':
      restore();
      break;

    case 'startEditEntry':
      _.extend(store_, DEFAULT_STATE, action.entry, {
        isEdit: true
      });
      EditorState.emit(CHANGE_EVENT);
      break;
  }
});

function candidateType(el) {
  var type = el.type; // Assume it's "input".
  if (type == null) {
    return 'click';
  }
  switch (type.toLowerCase()) {
    case 'color':
    case 'date':
    case 'datetime':
    case 'datetime-local':
    case 'email':
    case 'month':
    case 'number':
    case 'password':
    case 'tel':
    case 'text':
    case 'textarea':
    case 'time':
    case 'url':
    case 'week':
      return 'input';
  }
  return 'click';
}

function restore() {
  _.extend(store_, DEFAULT_STATE);
  EditorState.emit(CHANGE_EVENT);
}
