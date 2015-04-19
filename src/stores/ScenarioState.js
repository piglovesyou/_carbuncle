
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
// var EditorState = require('./EditorState');
var Executor = require('../core/Executor');
var Persist = require('../persist');
var ScenariosStore = require('./ScenariosStore');
var {ObjectID} = require('mongodb');



var _store;
var _default = {
  _id: undefined,
  title: '',
  entries: [],
  isBlock: false
};
restoreCache();

try {
  _store = JSON.parse(window.localStorage.lastScenarioStore);
  if (_.isString(_store._id)) {
    _store._id = new ObjectID(_store._id);
  }
  resetExecutingState();
} catch(e) {
  _store = {
    _id: undefined,
    title: '',
    entries: [],
    isBlock: false
  };
}



var ScenarioState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = ScenarioState;

resetExecutingState();

ScenarioState.on(CHANGE_EVENT, () => {
  window.localStorage.lastScenarioStore = JSON.stringify(_store);
});



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
        resetExecutingState();
        ScenarioState.emit(CHANGE_EVENT);
        var last;
        executor.on('before', entry => {
          if (last) last['@executingState'] = 'done';
          last = entry;
          entry['@executingState'] = 'doing';
          ScenarioState.emit(CHANGE_EVENT);
        });
        executor.on('pass', () => {
          if (last) last['@executingState'] = 'done';
          ScenarioState.emit(CHANGE_EVENT);
        });
        executor.on('fail', () => {
          if (last) last['@executingState'] = 'fail';
          ScenarioState.emit(CHANGE_EVENT);
        });
        executor.on('end', () => {
          setTimeout(() => {
            resetExecutingState();
            ScenarioState.emit(CHANGE_EVENT);
          }, 30 * 1000);
        });
      }, 50);
      break;

    case 'saveScenario':
      Dispatcher.waitFor([ScenariosStore.dispatcherToken]);
      Persist.saveScenario(_store)
      .then(() => {
        // TODO
        console.log('-------', arguments);
        ScenarioState.emit(CHANGE_EVENT);
      })
      .catch(() => {
        console.log('xxx', arguments);
      });
      break;

    case 'deleteScenario':
      var scenario = action.scenario;
      if (_store._id !== scenario._id) {
        return;
      }
      restoreCache();
      break;

    case 'newScenario':
      restoreCache();
      ScenarioState.emit(CHANGE_EVENT);
      break;
  }
});



function resetExecutingState() {
  _store.entries.forEach(entry => delete entry['@executingState']);
}

function generateUID(entry) {
  var md5 = new goog.crypt.Md5();
  md5.update(String(Date.now()) + entry.css + entry.mode + entry.type);
  return goog.crypt.byteArrayToHex(md5.digest());
}

function restoreCache() {
  _store = {};
  _.each(_default, (v, k) => _store[k] = _.clone(v));
}
