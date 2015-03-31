
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Q = require('q');
Q.longStackSupport = true;
var CHANGE_EVENT = 'change';

var _store = {
  url: '',
  isSelectingElement: false,
  targetElementBounds: null,
  selectedIframeElementData: null
};



var Store = assign({}, EventEmitter.prototype, {

  get() {
    return _store;
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});
module.exports = Store;

Dispatcher.register(function(action) {
  switch(action.type) {
    case 'locationSubmit':
      _store.url = action.url;
      Store.emit(CHANGE_EVENT);
      break;
    case 'selectElement':
      _store.isSelectingElement = action.select;
      if (!action.select) {
        _store.targetElementBounds = null;
      }
      Store.emit(CHANGE_EVENT);
      break;
    case 'mouseMove':
      _store.targetElementBounds = action.bounds;
      Store.emit(CHANGE_EVENT);
      break;
    case 'selectIFrameElement':
      _store.isSelectingElement = false;
      _store.targetElementBounds = null;
      _store.selectedIframeElementData = action.selectedIframeElementData;
      Store.emit(CHANGE_EVENT);
      break;
  }
});
