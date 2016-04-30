import gui from 'nw.gui';
const win = require('nw.gui').Window.get();

module.exports = {
  timeout,
  showDevTools,
  closeDevTools
};

function showDevTools() {
  return new Promise(resolve => {
    gui.Window.get().showDevTools(null, resolve);
  });
}

async function closeDevTools() {
  win.closeDevTools();
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
