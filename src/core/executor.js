const {WebDriver, By, until} = require('selenium-webdriver');
const Driver = require('./driver');
const {timeout, showDevTools, closeDevTools} = require('../util');
const BrowserEmitter = require('../emitter/browser');
const Locator = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');

module.exports = {execute};

async function execute(steps) {

  // Hack: driver doesn't work when devtools has never shown.
  // TODO: Move this to application launching
  await showDevTools();
  await closeDevTools();

  const driver = await Driver.get();

  for (let step of steps) {
    
    try {
      switch (step.type.name) {

        case 'get':

          await open(step.url);
          break;

        case 'clickElement':
        case 'setElementText':
        case 'sendKeysToElement':

          const locator = By[step.locator.getName()](step.locator.getValue());
          // Carbuncle always waits when to operate an element for stability. Why not?
          const element = driver.wait(until.elementLocated(locator), 4 * 1000);
          switch (step.type.name) {
            case 'clickElement':
              await element.click();
              break;
            case 'setElementText':
            case 'sendKeysToElement':
              await element.sendKeys(step.text);
              break;
          }
          break;

        case 'goBack':
          BrowserEmitter.emit('goBack');
          break;

        case 'refresh':
          BrowserEmitter.emit('refresh');
          break;

        default:
          await showDevTools();
          throw new Error('TODO: ' + step.type.name);
          break;

      }

    } catch(e) {
      await showDevTools();
      await timeout(800);
      debugger;
    }
  }
}

function open(url) {
  return new Promise((resolve, reject) => {
    global.carbuncleTargetFrame.addEventListener('load', handleIFrameLoad);
    global.carbuncleTargetFrame.src = url;
    // Let it fails when it's too late
    const timer = setTimeout(handleIFrameFails, 4 * 1000);
    function handleIFrameLoad(e) {
      cleanup();
      resolve();
    }
    function handleIFrameFails(e) {
      cleanup();
      reject();
    }
    function cleanup() {
      global.carbuncleTargetFrame.removeEventListener('load', handleIFrameLoad);
      clearTimeout(timer);
    }
  });
}