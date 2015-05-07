var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var {CHANGE_EVENT} = require('../constants');

var TIMEOUT = 7 * 1000;
var DEFAULT_STATE = {
  active: false,
  icon: null,
  message: '', // If not empty, show notification
  linkUrl: null,
  type: null // warning, danger, info..
};

var store_ = goog.object.clone(DEFAULT_STATE);

var NotifyState = assign({}, EventEmitter.prototype, {
  get() {
    return store_;
  }
}, require('./mixins_'));
module.exports = NotifyState;



var timerId;
NotifyState.dispatcherToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'notify':
      store_ = action.notifyData;
      if (store_.active === false) {
        restore();
        return;
      }
      store_.active = true;
      clearTimeout(timerId);
      timerId = setTimeout(restore, TIMEOUT);
      NotifyState.emit(CHANGE_EVENT);
      break;
  }
});

function restore() {
  clearTimeout(timerId);
  timerId = null;
  // To show fading message
  store_.active = false;
  NotifyState.emit(CHANGE_EVENT);
}
