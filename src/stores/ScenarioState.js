
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var EditorState = require('./EditorState');



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
      // TODO
      break;
    case 'insertEntry':
      Dispatcher.waitFor([EditorState.dispatcherToken]);
      action.entry.id = generateUID(action.entry);
      _store.entries.push(action.entry);
      ScenarioState.emit(CHANGE_EVENT);
      break;
    case 'deleteEntry':
      var deleted = goog.array.removeIf(_store.entries, entry => action.id === entry.id);
      if (!deleted) {
        throw new Error('something wrong with deleteEntry');
      }
      ScenarioState.emit(CHANGE_EVENT);
      break;
  }
});



function generateUID(entry) {
  var md5 = new goog.crypt.Md5();
  md5.update(String(Date.now()) + entry.css + entry.mode + entry.type);
  return goog.crypt.byteArrayToHex(md5.digest());
}
