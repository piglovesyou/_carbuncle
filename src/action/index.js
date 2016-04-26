const {HashLocation} = require('react-router');
const dispatcher = require('../dispatcher');

module.exports = {dispatch, dispatchBrowserStateChange};

function dispatch(type, payload) {
  dispatcher.dispatch(Object.assign(payload || {}, {type}));
}

function dispatchBrowserStateChange(newState) {
  // XXX: Can't I remove this function?
  dispatcher.dispatch({
    type: 'browser-state-change',
    state: newState
  });
}
