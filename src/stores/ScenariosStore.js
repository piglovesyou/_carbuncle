
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');
var Persist = require('../persist');
var ScenarioState = require('./ScenarioState');

var PER_PAGE = 20;



var _store;
var _default = {
  total: -1,
  list: [],
  map: []
};
restoreCache();

var ScenariosStore = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  },

  sync(page) {
    var skip = PER_PAGE * page;
    var limit = _store.total < 0 ? PER_PAGE : _store.total - skip;
    var range = _.range(skip, limit);
    if (range.every(i => !!_store.list[i] && !_store.list[i]['@expired'])) return;
    return Persist.getScenarios(page)
    .then(data => {
      _store.total = data.total;
      data.docs.forEach((doc, i) => {
        _store.map[doc._id] = _store.list[data.skip + i] = doc;
      });
      console.log('before emit');
      ScenariosStore.emit(CHANGE_EVENT);
    });
  }
}, require('./_mixins'));
module.exports = ScenariosStore;

ScenariosStore.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'saveScenario':
      restoreCache();
      break;
  }
});



function restoreCache() {
  _store = {};
  _.each(_default, (v, k) => _store[k] = _.clone(v));
}
