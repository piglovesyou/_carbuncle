

var Dispatcher = require('../dispatcher');


module.exports = {
  locationSubmit(url) {
    Dispatcher.dispatch({
      type: 'locationSubmit',
      url: url
    });
  },
  selectElement(select) {
    Dispatcher.dispatch({
      type: 'selectElement',
      select: select
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
  }

};
