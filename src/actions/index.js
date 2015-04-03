

var Dispatcher = require('../dispatcher');


module.exports = {
  locationSubmit(state) {
    Dispatcher.dispatch({
      type: 'locationSubmit',
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
  }

};
