
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Q = require('q');
Q.longStackSupport = true;
var CHANGE_EVENT = 'change';

var _store = {
  url: '',
  isSelectingElement: false
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
      Store.emit(CHANGE_EVENT, { url: _store.url });
      break;
    case 'selectElement':
      _store.isSelectingElement = action.select;
      Store.emit(CHANGE_EVENT, { isSelectingElement: _store.isSelectingElement });
      break;
  }
});
