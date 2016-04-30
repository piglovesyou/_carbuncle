import {HashLocation} from 'react-router';
import dispatcher from '../dispatcher';
import db from '../persist';
import {convertStepToJson, convertStepToInstance} from '../util/persist';
import userdata from '../persist/userdata';

const action = module.exports = {

  dispatchBrowserStateChange(newState) {
    // XXX: Can't I remove this function?
    dispatcher.dispatch({
      type: 'browser-state-change',
      state: newState
    });
  },

  async saveTestCase(payload) {
    const [id] = await db.testcases.put({
      key: payload.id,
      title: payload.title,
      steps: payload.steps.map(convertStepToJson),
      modifiedAt: new Date(),
    });
    if (!id) return;
    userdata.put('lastTestCaseId', id);
    action.dispatchBrowserStateChange({ testCaseId: id });
  },

  dispatch(type, payload) {
    dispatcher.dispatch(Object.assign(payload || {}, {type}));
  },

};
