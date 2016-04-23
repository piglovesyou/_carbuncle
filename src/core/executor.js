const {WebDriver, By, until} = require('selenium-webdriver');
const Driver = require('./driver');
const {timeout, showDevTools, closeDevTools} = require('../util');
const BrowserEmitter = require('../emitter/browser');
const Locator = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');
const {dispatch} = require('../dispatcher');

const VERIFY_TIMEOUT = 800;

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
        let getActual;
        let operator;
        switch (step.type.name) {

          case 'verifyElementValue':
            expected = step.value;
            getActual = () => findElement(driver, step.locator).getAttribute('value');
            operator = 'eq';
            break;

          case 'verifyTextPresent':
            // ref. builder.selenium2.rcPlayback.types.verifyTextPresent
            expected = step.text;
            getActual = () => findElement(driver, By.tagName('body')).getText();
            operator = 'contains';
            break;

          default:
            throw new Error(step);
            break;
        }
        let lastActual;
        const result = await driver.wait(() => {
          return getActual().then(actual => {
            lastActual = actual;
            return verifyResults(expected, actual, operator);
          });
        }, VERIFY_TIMEOUT);
        dispatch({ type: 'step-executed', step, result, expected, lastActual });
        BrowserEmitter.emit('step-executed', step, result, expected, lastActual);
        if (result === false) {
          console.log(expected, 'xxxxxxxxxxxxx', actual);
          somethingBadOccured = true;
          break;
        }

      } else {
        switch (step.type.name) {

          case 'get':
            await open(step.url);
            break;

          case 'goBack':
            dispatch({ type: 'goBack' });
            BrowserEmitter.emit('goBack');
            break;

          case 'goForward':
            // TODO
            break;

          case 'clickElement':
            findElement(driver, step.locator).click();
            break;

          case 'setElementText':
          case 'sendKeysToElement':
            await findElement(driver, step.locator).sendKeys(step.text);
            break;

          case 'doubleClickElement':
            await driver.actions().doubleClick(
                await findElement(driver, step.locator).then(el => el));
            break;

          case 'refresh':
            dispatch({ type: 'refresh' });
            BrowserEmitter.emit('refresh');
            break;

          default:
            throw new Error('TODO: ' + step.type.name);
            break;
        }
        // TODO When a step goes bad, it should pass false
        //      eg) element not found
        dispatch({ type: 'step-executed', step });
        BrowserEmitter.emit('step-executed', step, true);
      }

    } catch(e) {
      await showDevTools();
      await timeout(800);
      debugger;
    }
  }
  dispatch({ type: 'testcase-executed', somethingBadOccured });
  BrowserEmitter.emit('testcase-executed', somethingBadOccured);
}

function verifyResults(expected, actual, operator) {
  switch(operator) {
    case 'eq':
      return expected === actual;
    case 'contains':
      return actual.includes(expected);
    default:
      throw new Error('wrong operator key');
  }
}

function findElement(driver, locator) {
  const l = locator instanceof By
      ? locator
      : By[locator.getName()](locator.getValue());
  // Carbuncle always waits when to operate an element for stability. Why not?
  return driver.wait(until.elementLocated(l), 4 * 1000);
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
