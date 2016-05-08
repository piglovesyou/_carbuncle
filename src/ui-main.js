/*eslint no-unreachable: 0*/
/*eslint no-debugger: 0*/

// TODO: Is there way to write stdout down as a log file in nwjs?

import getpid from 'getpid';
import {render} from 'react-dom';
import routes from './routes';
import Driver from './core/driver';
import {PROCESS_NAME} from './const';
import kill from 'tree-kill';
import {timeout, showDevTools, closeDevTools} from './util';
const isProduction = process.env.NODE_ENV === 'production';

render(routes, document.getElementById('application-container'));

const win = require('nw.gui').Window.get();
if (!isProduction) win.moveTo(0, 20);
win.on('close', () => {
  win.hide();
  getpid(PROCESS_NAME, async function (err, pid) {
    if (err || !pid) {
      const driver = await Driver.getDefaultContent();
      await timeout(400); // For stable closing
      driver.quit();
    } else {
      // Send SIGTERM
      kill(pid);
    }
  });
});

console.log(isProduction);
if (isProduction) {
  (async function () {
    // Hack: driver doesn't work when devtools has never shown.
    // So we do that on application launching.
    await showDevTools();
    await closeDevTools();
  })();
}
