
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT, PER_PAGE} = require('../constants');
var Persist = require('../persist');



var DEFAULT_STORE = {
  total: -1,
  list: [],
  map: []
};

class ScenarioList extends EventEmitter {
  constructor() {
    super();
    this.restoreCache();
    this.dispatcherToken = Dispatcher.register(this._dispatcherHandler.bind(this));
  }
  _dispatcherHandler(action) {
    switch (action.type) {
      case 'saveScenario':
        this.restoreCache();
        break;
      case 'deleteScenario':
        // TODO: Update total
        var {scenario} = action;
        Persist.deleteScenario(scenario._id)
        .then(() => {
          if (goog.array.removeIf(this._store.list, s => String(s._id) === String(scenario._id))) {
            delete this._store.map[scenario._id];
            this._store.total = Math.max(this._store.total - 1, 0);
            this.emit(CHANGE_EVENT);
          }
        });
        break;
    }
  }
  get() {
    return _.clone(this._store);
  }
  sync(page) {
    var skip = PER_PAGE * page;
    var limit = this._store.total < 0 ? PER_PAGE : Math.min(this._store.total - skip, PER_PAGE);
    var range = _.range(skip, skip + limit);
    if (this._store.total >= 0 &&
        range.every(i =>
          !!this._store.list[i] &&
          !this._store.list[i]['@expired'])) {
      return;
    }
    return Persist.getScenarios(page)
    .then(data => {
      this._store.total = data.total;
      data.docs.forEach((doc, i) => {
        this._store.map[doc._id] = this._store.list[data.skip + i] = doc;
      });
      this.emit(CHANGE_EVENT);
    });
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  restoreCache() {
    this._store = _.clone(DEFAULT_STORE);
  }
}

module.exports = new ScenarioList;
