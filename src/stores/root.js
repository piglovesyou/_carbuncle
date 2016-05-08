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
      const subject = `Testcase${action.title ? ` "${action.title}"` : ''}`;
      const message = action.failedStep
        ? `${subject} has screwed up${action.failedStep.step_name ? ` because of ${action.failedStep.step_name}` : ''}!`
        : `Testcase${action.title ? ` "${action.title}"` : ''} has sucessfully executed.`;
      return Object.assign({}, { notification: message });
    case 'root-state-change':
      return Object.assign({}, state, action.state);
    }
    return state;
  }
}

module.exports = new Store(dispatcher);
