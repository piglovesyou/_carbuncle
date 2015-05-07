
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
// var EditorState = require('./EditorState');
var Executor = require('../core/Executor');
var Persist = require('../persist');
var ScenarioList = require('./ScenarioList');
var {ObjectID} = require('mongodb');
var Actions = require('../actions');
var ComponentHelper = require('../components/helper');



var store_;
var default_ = {
  _id: undefined,
  title: '',
  entries: [],
  isBlock: false,
  updatedBy: null
};
restoreCache();

try {
  store_ = JSON.parse(window.localStorage.lastScenarioStore);
  if (_.isString(store_._id)) {
    store_._id = new ObjectID(store_._id);
  }
  resetExecutingState();
} catch(e) {
  store_ = {
    _id: undefined,
    title: '',
    entries: [],
    isBlock: false
  };
}



var ScenarioState = assign({}, EventEmitter.prototype, {
  get() {
    return store_;
  }
}, require('./mixins_'));
module.exports = ScenarioState;

resetExecutingState();

ScenarioState.on(CHANGE_EVENT, () => {
  window.localStorage.lastScenarioStore = JSON.stringify(store_);
});



var previewResetTimer;
ScenarioState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'selectBlock':
      // TODO
      console.log('--', action.blockData);
      break;

    case 'editEntry':
      var i = goog.array.findIndex(store_.entries, entry => action.entry.id === entry.id);
      if (i < 0) {
        throw new Error('something wrong with editEntry@ScenarioState');
      }
      store_.entries.splice(i, 1, action.entry);
      break;

    case 'insertEntry':
      action.entry.id = generateUID(action.entry);
      store_.entries.push(action.entry);
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'deleteEntry':
      var deleted = goog.array.removeIf(store_.entries, entry => action.id === entry.id);
      if (!deleted) {
        throw new Error('something wrong with deleteEntry@ScenarioState');
      }
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'changeScenario':
      _.extend(store_, action.scenario);
      ScenarioState.emit(CHANGE_EVENT);
      break;

    case 'preview':

      previewResetTimer = setTimeout(() => { // I don't know why I need this. Obviously it's nw's bug.
        var executor = new Executor(store_.entries, 100);
        resetExecutingState();
        ScenarioState.emit(CHANGE_EVENT);
        var last;
        executor.on('before', entry => {
          if (last) last['@executingState'] = 'done';
          entry['@executingState'] = 'doing';
          ScenarioState.emit(CHANGE_EVENT);
          Actions.notify({
            icon: ComponentHelper.getIconKey(entry.mode, entry.type),
            message: (entry.title || '') + '...'
          });
          last = entry;
        });
        executor.on('pass', () => {
          if (last) last['@executingState'] = 'done';
          ScenarioState.emit(CHANGE_EVENT);
          Actions.notify({
            type: 'success',
            icon: 'smile-o',
            message: (store_.title ? 'シナリオ「' + store_.title + '」が' : '') + '成功しました'
          });
        });
        executor.on('fail', () => {
          if (last) last['@executingState'] = 'fail';
          ScenarioState.emit(CHANGE_EVENT);
          Actions.notify({
            type: 'danger',
            icon: 'frown-o',
            message: (store_.title ? 'シナリオ「' + store_.title + '」が' : '') + '失敗しました'
          });
        });
        executor.on('end', () => {
          previewResetTimer = setTimeout(() => {
            resetExecutingState();
            ScenarioState.emit(CHANGE_EVENT);
          }, 3 * 1000);
        });
      }, 50);
      break;

    case 'startEditScenario':
      store_ = _.clone(action.scenario);
      break;

    case 'saveScenario':
      Dispatcher.waitFor([ScenarioList.dispatcherToken]);
      Persist.saveScenario(store_)
      .then(() => {
        ScenarioState.emit(CHANGE_EVENT);
      })
      .catch(err => {
        console.error('xxx', err.stack);
      });
      break;

    case 'deleteScenario':
      var scenario = action.scenario;
      if (store_._id !== scenario._id) {
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
  clearTimeout(previewResetTimer);
  store_.entries.forEach(entry => delete entry['@executingState']);
}

function generateUID(entry) {
  var md5 = new goog.crypt.Md5();
  md5.update(String(Date.now()) + entry.css + entry.mode + entry.type);
  return goog.crypt.byteArrayToHex(md5.digest());
}

function restoreCache() {
  store_ = {};
  _.each(default_, (v, k) => store_[k] = _.clone(v));
}
