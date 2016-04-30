import {ReduceStore} from 'flux/utils';
import {Modes} from '../const/browser';
import assert from 'assert';
import db from '../persist';
import dispatcher from '../dispatcher';
import {dispatch, dispatchBrowserStateChange} from '../action';
import {convertStepToJson, convertStepToInstance} from '../util/persist';
import {generateHash} from '../util';
import userdata from '../persist/userdata';

class BrowserStore extends ReduceStore {
  constructor(x) {
    super(x);

    const lastTestCaseId = userdata.get('lastTestCaseId');
    if (lastTestCaseId != null) {
      db.testcases.get(lastTestCaseId).then(testCase => {
        if (testCase == null) {
          return;
        }
        dispatch('testcase-loaded', {
          id: testCase.key,
          steps: testCase.steps
        });
      })
    }
  }

  getInitialState() {
    this.previousMode_ = null;
    return {
      mode: Modes.NEUTRAL,
      testCaseId: undefined,
      testCase: [],
      location: null,
      spotRect: null,
      selectedPaletteTab: 'steps',
    };
  }

  reduce(state, action) {
    let newState;
    switch (action.type) {
      case 'testcase-loaded':
        newState = Object.assign({}, state);
        // TODO why do I need this
        newState.testCaseId = action.id;
        newState.testCase = action.steps.map(convertStepToInstance);
        break;

      case 'save-testcase':
        {
          // debugger;
          db.testcases.put({
            key: action.id,
            steps: action.steps.map(convertStepToJson),
            modifiedAt: Date.now()
          }).then(([id]) => {
            dispatchBrowserStateChange({ testCaseId: id });
            userdata.put('lastTestCaseId', id);
          });
          newState = state;
        }
        break;

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
          dispatchBrowserStateChange({
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

      case 'remove-step':
        {
          assert(state.testCase.find(step => step.id === action.step.id));
          newState = Object.assign({}, state, {
            testCase: state.testCase.filter(step => step.id !== action.step.id)
          });
        }
        break;

      case 'browser-state-change':
        newState = Object.assign({}, state, action.state);
        break;

      default:
        return state;
    }
    assert(newState);
    if (state.mode !== newState.mode) this.previousMode_ = state.mode;
    return newState;
  }
}

module.exports = new BrowserStore(dispatcher);
