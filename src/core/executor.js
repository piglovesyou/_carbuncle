const {WebDriver, By, until} = require('selenium-webdriver');
const Driver = require('./driver');
const {timeout, showDevTools, closeDevTools} = require('../util');
const BrowserEmitter = require('../emitter/browser');
const PaletteEmitter = require('../emitter/palette');
const Locator = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');

module.exports = {execute};

async function execute(steps) {

  // Hack: driver doesn't work when devtools has never shown.
  // TODO: Move this to application launching
  await showDevTools();
  await closeDevTools();

  const driver = await Driver.get();
  let somethingBadOccured = false;

  for (let step of steps) {
    
    try {
      // TODO: When the next step is an operation on an element,
      // use driver.actions().mouseMove() more to emulate a user behavior.

      if (step.type.name.startsWith('verify')) {
        let expected;
        let actual;
        switch (step.type.name) {

          case 'verifyElementValue':
            expected = step.value;
            actual = await findElement(driver, step).getAttribute('value');
            break;

          default:
            throw new Error(step);
            break;
        }
        PaletteEmitter.emit('step-executed', step, expected === actual, expected, actual);
        if (expected !== actual) {
          somethingBadOccured = true;
          break;
        }

      } else {
        switch (step.type.name) {

          case 'get':
            await open(step.url);
            break;

          case 'goBack':
            BrowserEmitter.emit('goBack');
            break;

          case 'refresh':
            BrowserEmitter.emit('refresh');
            break;

          case 'clickElement':
            findElement(driver, step).click();
            break;

          case 'setElementText':
          case 'sendKeysToElement':
            await findElement(driver, step).sendKeys(step.text);
            break;

          default:
            throw new Error('TODO: ' + step.type.name);
            break;
        }
        // TODO When a step goes bad, it should pass false
        //      eg) element not found
        PaletteEmitter.emit('step-executed', step, true);
      }

    } catch(e) {
      await showDevTools();
      await timeout(800);
      debugger;
    }
  }
  PaletteEmitter.emit('testcase-executed', somethingBadOccured);
}

function findElement(driver, step) {
  const locator = By[step.locator.getName()](step.locator.getValue());
  // Carbuncle always waits when to operate an element for stability. Why not?
  return driver.wait(until.elementLocated(locator), 4 * 1000);
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
