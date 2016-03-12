const _ = require('underscore');
const {CHANGE_EVENT, PER_PAGE} = require('../constants');
const Persist = require('../persist');
const Base = require('./base');
const {deepClone} = require('../tools/object');

const default_ = {
  total: -1,
  list: [],
  map: []
};

class ScenarioListBase extends Base {
  constructor() {
    super();
    this.restoreCache();
    this.filter = null;
  }
  dispatcherHandler_(action) {
    switch (action.type) {
    case 'saveScenario':
      this.restoreCache();
      break;
    case 'deleteScenario':
        // TODO: Update total
      var {scenario} = action;
      Persist.deleteScenario(scenario._id)
        .then(() => {
          if (goog.array.removeIf(this.store_.list, s => String(s._id) === String(scenario._id))) {
            delete this.store_.map[scenario._id];
            this.store_.total = Math.max(this.store_.total - 1, 0);
            this.emit(CHANGE_EVENT);
          }
        });
      break;
    }
  }
  sync(page) {
    var skip = PER_PAGE * page;
    var limit = this.store_.total < 0 ? PER_PAGE : Math.min(this.store_.total - skip, PER_PAGE);
    var range = _.range(skip, skip + limit);
    if (this.store_.total >= 0 &&
        range.every(i =>
          !!this.store_.list[i] &&
          !this.store_.list[i]['@expired'])) {
      return;
    }
    return Persist.getScenarios(page, this.filter)
    .then(data => {
      this.store_.total = data.total;
      data.docs.forEach((doc, i) => {
        this.store_.map[doc._id] = this.store_.list[data.skip + i] = doc;
      });
      this.emit(CHANGE_EVENT);
    });
  }
  restoreCache() {
    this.store_ = deepClone(default_);
  }
}

module.exports = ScenarioListBase;
