const _ = require('underscore');
const {CHANGE_EVENT} = require('../constants');
const Base = require('./base');
const {deepClone} = require('../tools/object');

const default_ = {
  title: '',
  css: '',
  id: '',
  mode: 'action',
  type: 'click',
  text: '',
  isEdit: false
};

class EditorState extends Base {
  constructor() {
    super();
    this.store_ = _.clone(default_);
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
      // var elementRef = action.selectedIframeElementData.elementRef;
      delete action.selectedIframeElementData.elementRef;
      _.extend(this.store_, action.selectedIframeElementData);
      if (this.store_.mode === 'action' && (this.store_.type !== 'click' || this.store_.type !== 'input')) {
        // this.store_.type = candidateType(elementRef);
      }
      this.store_.text = '';
      this.emit(CHANGE_EVENT);
      break;

    case 'deleteEntry':
      if (this.store_.id === action.id) {
        this.restore();
      }
      break;

    case 'editEntry':
    case 'cancelEdit':
    case 'insertEntry':
      this.restore();
      break;

    case 'startEditEntry':
      _.extend(this.store_, default_, action.entry, {
        isEdit: true
      });
      this.emit(CHANGE_EVENT);
      break;
    }
  }
  restore() {
    this.store_ = deepClone(default_);
    this.emit(CHANGE_EVENT);
  }
}

module.exports = new EditorState();
