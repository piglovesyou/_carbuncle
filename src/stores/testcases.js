import {ReduceStore} from 'flux/utils';
import dispatcher from '../dispatcher';
import assert from 'assert';
import db from '../persist';

class TestCasesStore extends ReduceStore {
  getInitialState() {
    return {
      testCase: [],
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'save-testcase':
        {
          // console.log(action)
          break;
        }

      default:
        return state;
    }
    return state;
  }
}

module.exports = new TestCasesStore(dispatcher);

