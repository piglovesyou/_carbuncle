import {HashLocation} from 'react-router';
import dispatcher from '../dispatcher';
import db from '../persist';
import {convertStepToJson, convertStepToInstance} from '../util/persist';
import userdata from '../persist/userdata';

const action = module.exports = {

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

  async loadTestCase(id) {
    if (id == null) return;
    userdata.put('lastTestCaseId', id);
    const testCase = await db.testcases.get(id);
    if (testCase == null) return;
    action.dispatchBrowserStateChange({
      testCaseId: testCase.key,
      testCaseTitle: testCase.title,
      testCase: testCase.steps.map(convertStepToInstance),
    });
  },

  async loadLastTestCase() {
    return action.loadTestCase(userdata.get('lastTestCaseId'));
  },

  async loadTestCases(page) {
    const testCases = await db.testcases.key.getAll();
    return action.dispatchTestCasesStateChange({ testCases });
  },

  dispatchRootStateChange(newState) {
    // XXX: Refactor
    dispatcher.dispatch({
      type: 'root-state-change',
      state: newState
    });
  },

  dispatchTestCasesStateChange(newState) {
    // XXX: Refactor
    dispatcher.dispatch({
      type: 'testcases-state-change',
      state: newState
    });
  },

  dispatchBrowserStateChange(newState) {
    // XXX: Refactor
    dispatcher.dispatch({
      type: 'browser-state-change',
      state: newState
    });
  },

  dispatch(type, payload) {
    dispatcher.dispatch(Object.assign(payload || {}, {type}));
  },

};
