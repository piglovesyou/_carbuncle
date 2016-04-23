const {ReduceStore} = require('flux/utils');
const {Modes} = require('../const/browser');
const dispatcher = require('../dispatcher');
const assert = require('power-assert');

class BrowserStore extends ReduceStore {
  getInitialState() {
    this.previousMode_;
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
    switch (action.type) {
      case 'step-executed':
        return Object.assign({}, state, {
          testCase: state.testCase.map(step => {
            if (step.id === action.step.id) {
              step.isSuccessfullyExecuted_ = true;
            }
            return step;
          })
        });

      case 'testcase-executed':
        setTimeout(() => {
          dispatcher.dispatch({
            type: 'change', data: {
              testCase: state.testCase.map(step => {
                step.isSuccessfullyExecuted_ = null;
                return step;
              })
            }
          });
        }, 2400);
        const mode = this.previousMode_;
        if (state.mode !== mode) this.previousMode_ = state.mode;
        return Object.assign({}, state, { mode });
        return

      case 'click-recording':
        {
          assert(state.mode === Modes.NEUTRAL || state.mode === Modes.RECORDING);
          const mode = state.mode === Modes.NEUTRAL ? Modes.RECORDING : Modes.NEUTRAL;
          if (state.mode !== mode) this.previousMode_ = state.mode;
          return Object.assign({}, state, { mode });
        }

      case 'click-selecting-verify-step':
        {
          assert(state.mode === Modes.RECORDING || state.mode === Modes.SELECTING);
          const mode = state.mode === Modes.RECORDING ? Modes.SELECTING : Modes.RECORDING;
          if (state.mode !== mode) this.previousMode_ = state.mode;
          return Object.assign({}, state, { mode });
        }
        
      case 'append-step':
        {
          assert(state.mode === Modes.RECORDING || state.mode === Modes.SELECTING);
          return Object.assign({}, state, {
            testCase: state.testCase.concat(action.step)
          });
        }

      case 'change':
        return Object.assign({}, state, action.data);

      default:
        return state;
    }
  }
}

module.exports = new BrowserStore(dispatcher);
