
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var {Actions} = require('../constants');
var assign = require('object-assign');
var Q = require('q');
Q.longStackSupport = true;
var CHANGE_EVENT = 'change';

var _store = {
  count: 0
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
  },

  increment() {
    _store.count++;
    this.emit(CHANGE_EVENT);
  }

});
module.exports = Store;

Dispatcher.register(function(action) {
  switch(action.type) {
    case Actions.CHECKAS:
      break;
  }
});
