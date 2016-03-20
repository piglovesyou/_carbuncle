const {render} = require('react-dom');
const routes = require('./routes');
const Driver = require('./core/driver');

render(routes, document.getElementById('application-container'));

const win = require('nw.gui').Window.get();
win.moveTo(200, 150);
win.showDevTools();

win.on('close', async () => {
  const driver = await Driver.getDefaultContent();
  await timeout(400); // I don't know why I need this timeout to close stablly
  // We don need to call `driver.close()`, let nw.js close its window by itself.
  driver.quit().thenFinally(() => {
    win.close(true);
  });
  // TODO: `chromedriver` process still exists. How do we terminate it from nw?
});

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
