
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var EditorState = require('./EditorState');
var Executor = require('../core/Executor');



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
      var i = goog.array.findIndex(_store.entries, entry => action.entry.id === entry.id);
      if (i < 0) {
        throw new Error('something wrong with editEntry@ScenarioState');
      }
      _store.entries.splice(i, 1, action.entry);
      break;

    case 'insertEntry':
      action.entry.id = generateUID(action.entry);
      _store.entries.push(action.entry);
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'deleteEntry':
      var deleted = goog.array.removeIf(_store.entries, entry => action.id === entry.id);
      if (!deleted) {
        throw new Error('something wrong with deleteEntry@ScenarioState');
      }
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'changeScenario':
      _.extend(_store, action.scenario);
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'preview':

      setTimeout(() => { // I don't know why I need this. Obviously it's nw's bug.
        var executor = new Executor(_store.entries, 400);
        executor.on('before', entry => console.log('before', entry))
        executor.on('pass', entry => console.log('before', entry))
        executor.on('fail', entry => console.log('before', entry))
      }, 0);

      break;
  }
});



function generateUID(entry) {
  var md5 = new goog.crypt.Md5();
  md5.update(String(Date.now()) + entry.css + entry.mode + entry.type);
  return goog.crypt.byteArrayToHex(md5.digest());
}
