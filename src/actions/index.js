

var Dispatcher = require('../dispatcher');


module.exports = {
  locationSubmit(url) {
    Dispatcher.dispatch({
      type: 'locationSubmit',
      url: url
    });
  },
  enableSelectElement(enable) {
    Dispatcher.dispatch({
      type: 'enableSelectElement',
      enable: enable
    });
  },
  mouseMove(bounds) {
    Dispatcher.dispatch({
      type: 'mouseMove',
      bounds: bounds
    });
  },
  selectIFrameElement(selectedIframeElementData) {
    Dispatcher.dispatch({
      type: 'selectIFrameElement',
      selectedIframeElementData: selectedIframeElementData
    });
  },


  editorChange(state) {
    Dispatcher.dispatch({
      type: 'editorChange',
      state
    });
  }

};
