
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');

var default_ = {
  title: '',
  css: '',
  id: '',
  mode: 'action',
  type: 'click',
  text: '',
  isEdit: false
};

class EditorState extends EventEmitter {
  constructor() {
    super();
    this.store_ = _.clone(default_);
    this.dispatcherToken = Dispatcher.register(this.dispatcherHandler_.bind(this));
  }
  get() {
    return this.store_;
  }
  dispatcherHandler_(action) {
    switch (action.type) {
      case 'locationChange':
        this.store_ = _.extend({}, default_, {
          title: action.state.title,
          mode: 'action',
          type: 'open',
          text: action.state.url
        });
        this.emit(CHANGE_EVENT);
        break;

      case 'editorChange':
        _.extend(this.store_, action.state);
        this.emit(CHANGE_EVENT, {editorState: action.state});
        break;

      case 'iframeScroll':
        this.emit(CHANGE_EVENT, {editorState: this.get()});
        break;

      case 'selectIFrameElement':
        var elementRef = action.selectedIframeElementData.elementRef;
        delete action.selectedIframeElementData.elementRef;
        _.extend(this.store_, action.selectedIframeElementData);
        if (this.store_.mode === 'action' && (this.store_.type !== 'click' || this.store_.type !== 'input')) {
          this.store_.type = candidateType(elementRef);
        }
        this.store_.text = '';
        this.emit(CHANGE_EVENT);
        break;

      case 'deleteEntry':
        if (this.store_.id === action.id) {
          restore();
        }
        break;

      case 'editEntry':
      case 'cancelEdit':
      case 'insertEntry':
        restore();
        break;

      case 'startEditEntry':
        _.extend(this.store_, default_, action.entry, {
          isEdit: true
        });
        this.emit(CHANGE_EVENT);
        break;
    }
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  restore() {
    this.store_ = _.clone(default_);
    this.emit(CHANGE_EVENT);
  }
}

module.exports = new EditorState();
