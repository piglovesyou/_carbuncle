
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Q = require('q');
Q.longStackSupport = true;
var {CHANGE_EVENT} = require('../constants');
// var _ = require('underscore');
// var EditorState = require('./EditorState');

var store_ = {
  isSelectingElement: false,
  isSelectingBlock: false,
  targetElementBounds: null
};



var Store = assign({}, EventEmitter.prototype, {

  get() {
    return store_;
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});
module.exports = Store;

Store.dispatcherToken = Dispatcher.register(function(action) {
  switch(action.type) {

    case 'startBlockSelect':
      store_.isSelectingBlock = action.enable;
      Store.emit(CHANGE_EVENT);
      break;

    case 'enableSelectElement':
      store_.isSelectingElement = action.enable;
      if (action.select) {
        store_.targetElementBounds = null;
      }
      Store.emit(CHANGE_EVENT);
      break;

    case 'mouseMove':
      store_.targetElementBounds = action.targetElementBounds;
      Store.emit(CHANGE_EVENT);
      break;

    case 'selectIFrameElement':
      store_.isSelectingElement = false;
      break;
  }
});
