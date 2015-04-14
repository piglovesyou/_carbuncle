

var Dispatcher = require('../dispatcher');


module.exports = {
  locationChange(state) {
    Dispatcher.dispatch({
      type: 'locationChange',
      state
    });
  },

  enableSelectElement(enable) {
    Dispatcher.dispatch({
      type: 'enableSelectElement',
      enable: enable
    });
  },

  mouseMove(targetElementBounds) {
    Dispatcher.dispatch({
      type: 'mouseMove',
      targetElementBounds
    });
  },

  selectIFrameElement(selectedIframeElementData) {
    Dispatcher.dispatch({
      type: 'selectIFrameElement',
      selectedIframeElementData
    });
  },

  editorChange(state) {
    Dispatcher.dispatch({
      type: 'editorChange',
      state
    });
  },

  insertEntry(entry) {
    Dispatcher.dispatch({
      type: 'insertEntry',
      entry
    });
  },

  editEntry(entry) {
    Dispatcher.dispatch({
      type: 'editEntry',
      entry
    });
  },

  deleteEntry(id) {
    Dispatcher.dispatch({
      type: 'deleteEntry',
      id
    });
  },

  cancelEdit(id) {
    Dispatcher.dispatch({
      type: 'cancelEdit',
      id
    });
  },

  startEditEntry(entry) {
    Dispatcher.dispatch({
      type: 'startEditEntry',
      entry
    });
  },

  changeScenario(scenario) {
    Dispatcher.dispatch({
      type: 'changeScenario',
      scenario
    });
  },

  changeSetting(form) {
    Dispatcher.dispatch({
      type: 'changeSetting',
      form
    });
  },

  preview() {
    Dispatcher.dispatch({
      type: 'preview'
    });
  },

  iframeScroll() {
    Dispatcher.dispatch({
      type: 'iframeScroll'
    });
  },

};
