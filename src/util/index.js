import gui from 'nw.gui';
const win = require('nw.gui').Window.get();

module.exports = {
  showDevTools() {
    return new Promise(resolve => {
      gui.Window.get().showDevTools(null, resolve);
    });
  },

  async closeDevTools() {
    win.closeDevTools();
  },

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  getRecordKeyForDisplay(rawId) {
    if (rawId == null) return '';
    const matched = rawId.match(/([^0\.]{8})/);
    return matched ? matched[1] : '';
  },
};

