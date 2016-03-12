const Dispatcher = require('../dispatcher');
const _ = require('underscore');
const {CHANGE_EVENT} = require('../constants');
// const EditorState = require('./EditorState');
const Executor = require('../core/Executor');
const Persist = require('../persist');
const ScenarioList = require('./ScenarioList');
const {ObjectID} = require('mongodb');
const Actions = require('../actions');
const ComponentHelper = require('../components/helper');
const Base = require('./base');
const {deepClone} = require('../tools/object');

const default_ = {
  _id: undefined,
  title: '',
  entries: [],
  isBlock: false,
  updatedBy: null
};

class ScenarioState extends Base {
  constructor() {
    super();
    this.restoreCache();
    try {
      this.store_ = JSON.parse(window.localStorage.lastScenarioStore);
      if (_.isString(this.store_._id)) {
        this.store_._id = new ObjectID(this.store_._id);
      }
      this.resetExecutingState();
    } catch (e) {
      this.store_ = {
        _id: undefined,
        title: '',
        entries: [],
        isBlock: false
      };
    }
    this.previewResetTimer = null;
  }
  dispatcherHandler_(action) {
    switch (action.type) {
    case 'selectBlock':
      // TODO
      console.log('--', action.blockData);
      break;

    case 'editEntry':
      const i = goog.array.findIndex(this.store_.entries, entry => action.entry.id === entry.id);
      if (i < 0) {
        throw new Error('something wrong with editEntry@ScenarioState');
      }
      this.store_.entries.splice(i, 1, action.entry);
      break;

    case 'insertEntry':
      action.entry.id = generateUID(action.entry);
      this.store_.entries.push(action.entry);
      this.emit(CHANGE_EVENT);
      break;

    case 'deleteEntry':
      const deleted = goog.array.removeIf(this.store_.entries, entry => action.id === entry.id);
      if (!deleted) {
        throw new Error('something wrong with deleteEntry@ScenarioState');
      }
      this.emit(CHANGE_EVENT);
      break;

    case 'changeScenario':
      _.extend(this.store_, action.scenario);
      this.emit(CHANGE_EVENT);
      break;

    case 'preview':

      this.previewResetTimer = setTimeout(() => { // I don't know why I need this. Obviously it's nw's bug.
        const executor = new Executor(this.store_.entries, 100);
        this.resetExecutingState();
        this.emit(CHANGE_EVENT);
        let last;
        executor.on('before', entry => {
          if (last) last['@executingState'] = 'done';
          entry['@executingState'] = 'doing';
          this.emit(CHANGE_EVENT);
          Actions.notify({
            icon: ComponentHelper.getIconKey(entry.isBlock, entry.mode, entry.type),
            message: (entry.title || '') + '...'
          });
          last = entry;
        });
        executor.on('pass', () => {
          if (last) last['@executingState'] = 'done';
          this.emit(CHANGE_EVENT);
          Actions.notify({
            type: 'success',
            icon: 'smile-o',
            message: (this.store_.title ? 'シナリオ「' + this.store_.title + '」が' : '') + '成功しました'
          });
        });
        executor.on('fail', () => {
          if (last) last['@executingState'] = 'fail';
          this.emit(CHANGE_EVENT);
          Actions.notify({
            type: 'danger',
            icon: 'frown-o',
            message: (this.store_.title ? 'シナリオ「' + this.store_.title + '」が' : '') + '失敗しました'
          });
        });
        executor.on('end', () => {
          this.previewResetTimer = setTimeout(() => {
            this.resetExecutingState();
            this.emit(CHANGE_EVENT);
          }, 3 * 1000);
        });
      }, 50);
      break;

    case 'startEditScenario':
      this.store_ = _.clone(action.scenario);
      break;

    case 'saveScenario':
      Dispatcher.waitFor([ScenarioList.dispatcherToken]);
      Persist.saveScenario(this.store_)
      .then(() => {
        this.emit(CHANGE_EVENT);
      })
      .catch(err => {
        console.error('xxx', err.stack);
      });
      break;

    case 'deleteScenario':
      const scenario = action.scenario;
      if (this.store_._id !== scenario._id) {
        return;
      }
      this.restoreCache();
      break;

    case 'newScenario':
      this.restoreCache();
      this.emit(CHANGE_EVENT);
      break;
    }
  }
  restoreCache() {
    this.store_ = deepClone(default_);
  }
  resetExecutingState() {
    clearTimeout(this.previewResetTimer);
    this.store_.entries.forEach(entry => delete entry['@executingState']);
  }
}

module.exports = new ScenarioState();

function generateUID(entry) {
  const md5 = new goog.crypt.Md5();
  md5.update(String(Date.now()) + entry.css + entry.mode + entry.type);
  return goog.crypt.byteArrayToHex(md5.digest());
}
