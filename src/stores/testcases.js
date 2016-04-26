const {ReduceStore} = require('flux/utils');
const dispatcher = require('../dispatcher');
const assert = require('assert');
const db = require('../persist');

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
          console.log(action)
          break;
        }

      default:
        return state;
    }
    return state;
  }
}

module.exports = new TestCasesStore(dispatcher);

