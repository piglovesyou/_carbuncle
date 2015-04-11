
var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Auth = require('../auth');
var Q = require('q');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');



var _store = window.localStorage;

var ScenarioState = assign({}, EventEmitter.prototype, {
  get() {
    return _store;
  }
}, require('./_mixins'));
module.exports = ScenarioState;



ScenarioState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'changeSetting':
      _.extend(_store, action.form);
      Auth.authenticate()
      .then(() => {
        console.log(arguments)
      })
      .catch(() =>
        console.log('xxx', arguments)
      )
      break;
  }
});
