import {ReduceStore} from 'flux/utils';
import dispatcher from '../dispatcher';
import assert from 'assert';
import db from '../persist';

class TestCasesStore extends ReduceStore {
  getInitialState() {
    return {
      testCases: [],
    };
  }

  reduce(state, action) {
    let newState;
    switch (action.type) {
      default:
        return state;

      case 'testcases-state-change':
        newState = Object.assign({}, state, action.state);
        break;
    }
    assert(newState);
    return newState;
  }
}

module.exports = new TestCasesStore(dispatcher);

