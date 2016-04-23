const {ReduceStore} = require('flux/utils');
const {Modes} = require('../const/browser');
const dispatcher = require('../dispatcher');
const assert = require('assert');

class BrowserStore extends ReduceStore {
  getInitialState() {
    this.previousMode_ = null;
    return {
      mode: Modes.NEUTRAL,
      testCase: [],
      location: null,
      spotRect: null,
      // _hook: 0
    };
  }

  areEqual(one, two) {
    return one === two;
  }

  reduce(state, action) {
    let newState;
    switch (action.type) {
      case 'step-executed':
        newState = Object.assign({}, state, {
          testCase: state.testCase.map(step => {
            if (step.id === action.step.id) {
              step.isSuccessfullyExecuted_ = true;
            }
            return step;
          })
        });
        break;

      case 'testcase-executed':
        setTimeout(() => {
          dispatcher.dispatchChange({
            testCase: state.testCase.map(step => {
              step.isSuccessfullyExecuted_ = null;
              return step;
            })
          });
        }, 2400);
        newState = Object.assign({}, state, { mode: this.previousMode_ });
        break;

      case 'click-recording':
        {
          assert(state.mode === Modes.NEUTRAL || state.mode === Modes.RECORDING);
          const mode = state.mode === Modes.NEUTRAL ? Modes.RECORDING : Modes.NEUTRAL;
          newState = Object.assign({}, state, { mode });
        }
        break;

      case 'click-selecting-verify-step':
        {
          assert(state.mode === Modes.RECORDING || state.mode === Modes.SELECTING);
          const mode = state.mode === Modes.RECORDING ? Modes.SELECTING : Modes.RECORDING;
          newState = Object.assign({}, state, { mode });
        }
        break;
        
      case 'append-step':
        {
          assert(state.mode === Modes.RECORDING || state.mode === Modes.SELECTING);
          newState = Object.assign({}, state, {
            testCase: state.testCase.concat(action.step)
          });
        }
        break;

      case 'change':
        newState = Object.assign({}, state, action.data);
        break;

      default:
        return state;
    }
    if (state.mode !== newState.mode) this.previousMode_ = state.mode;
    return newState || state;
  }
}

module.exports = new BrowserStore(dispatcher);
