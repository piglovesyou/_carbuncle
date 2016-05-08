/*eslint no-debugger: 0*/
import {WebDriver, By, until} from 'selenium-webdriver';
import Driver from './driver';
import {timeout, showDevTools, closeDevTools} from '../util';
import BrowserEmitter from '../emitter/browser';
import Locator from '../modified-selenium-builder/seleniumbuilder/content/html/builder/locator';
import {dispatch} from '../action';

const isProduction = process.env.NODE_ENV === 'production';
const VERIFY_TIMEOUT = 1600;

module.exports = {execute};

async function execute(testCase) {
  const {steps, title} = testCase;
  const driver = await Driver.get();

  let failedStep;
  let failedReason;

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
        }
        let lastActual;
        const result = await driver.wait(() => {
          return getActual().then(actual => {
            lastActual = actual;
            return verifyResults(expected, actual, operator);
          });
        }, VERIFY_TIMEOUT);
        dispatch('step-executed', { step, result, expected, lastActual });
        if (result === false) {
          throw new Error('Verify step failed.');
        }
      } else {
        switch (step.type.name) {
        case 'get':
          await open(step.url);
          break;

        case 'goBack':
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
          BrowserEmitter.emit('refresh');
          break;

        default:
          throw new Error('TODO: ' + step.type.name);
        }
        dispatch('step-executed', { step });
      }
    } catch (e) {
      failedStep = step;
      failedReason = e;
      // For debug
      if (!isProduction) {
        await showDevTools();
        await timeout(800);
        debugger;
      }
    }
  }
  dispatch('testcase-executed', Object.assign(testCase, { failedStep, failedReason }));
}

function verifyResults(expected, actual, operator) {
  switch (operator) {
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
