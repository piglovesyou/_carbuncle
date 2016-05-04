import dispatcher from '../dispatcher';
import {ReduceStore} from 'flux/utils';

class Store extends ReduceStore {
  getInitialState() {
    return {
      notification: null
    };
  }
  reduce(state, action) {
    switch (action.type) {
    case 'testcase-executed':
      return Object.assign({}, {
        notification: `Testcase${action.title ? ` "${action.title}"` : ''} has sucessfully executed`
      });
    case 'root-state-change':
      return Object.assign({}, state, action.state);
    }
    return state;
  }
}

module.exports = new Store(dispatcher);
