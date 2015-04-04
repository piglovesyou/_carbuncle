
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var CHANGE_EVENT = 'change';



var _store = {
  id: '',
  title: '',
  entries: [],
  isBlock: true//false
};

var ScenarioState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = ScenarioState;



ScenarioState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'editEntry':
      break;
    case 'insertEntry':
      action.entry.id = generateUID(action.entry);
      _store.entries.push(action.entry);
      ScenarioState.emit(CHANGE_EVENT);
      break;
  }
});



function generateUID(entry) {
  var md5 = new goog.crypt.Md5();
  md5.update(Date.now());
  md5.update(entry.title);
  md5.update(!!entry.isBlock);
  return goog.crypt.byteArrayToHex(md5.digest());
}
