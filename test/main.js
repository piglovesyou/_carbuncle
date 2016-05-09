import assert from 'assert';
import Q from 'q';
import getpid_ from 'getpid';
const getpid = Q.denodeify(getpid_);
import kill_ from 'tree-kill';
const kill = Q.denodeify(kill_);

import {CHROMEDRIVER_PORT} from '../src/const';
import {WebDriver, By, Key, until} from 'selenium-webdriver';
import HttpUtil from 'selenium-webdriver/http/util';
import Http from 'selenium-webdriver/http';
import Chrome from 'selenium-webdriver/chrome';
import {Command, Name} from 'selenium-webdriver/lib/command';
import {getDriver, switchToDefaultContent, switchToFrame, timeout, launchCarbuncle, terminateAll} from './lib';

describe('Carbuncle', function() {
  this.timeout(45 * 1000);
  this.retries(3);

  beforeEach(launchCarbuncle);
  afterEach(terminateAll);

  it('should correctly launch and halt', async function () {
    assert(await getpid('carbuncle'));
    assert(await getpid('chromedriver'));
    assert(await getpid('nw'));

    const driver = await getDriver();
    assert(await driver.isElementPresent(By.id('application-container')));

    await kill(await getpid('carbuncle'), null);
    assert(!(await getpid('carbuncle')));
    assert(!(await getpid('chromedriver')));
    await timeout(500); // nw needs time to terminate
    assert(!(await getpid('nw')));
  });

  it('records and playbacks general Google NCR operations', async function () {
    const driver = await getDriver();

    // Make sure playbacking is not starged
    assert(!(await driver.executeScript('return window.global.carbuncleLastTestCaseSucceeded')));

    // Start recording
    await driver.findElement(By.css('.browser__rec-btn')).click();

    // Open web site
    await driver.findElement(By.css('.browser__location-input input'))
    .sendKeys('http://www.google.com/ncr', Key.ENTER);

    await switchToFrame(driver);
    await driver.findElement(By.name('q'))
    .sendKeys('carbuncle', Key.ENTER);

    await switchToDefaultContent(driver);
    await driver.findElement(By.css('.step-adder__verify')).click();
    await timeout(400);

    await switchToFrame(driver);
    await driver.findElement(By.css('.g h3')).click();

    await switchToDefaultContent(driver);
    await timeout(400);
    await driver.findElement(By.css('.palette__playback-btn')).click();

    // Not good but we provide just enough time here
    await timeout(8 * 1000);

    // Make sure playbacking is not starged
    await switchToDefaultContent(driver);
    assert(await driver.executeScript('return window.global.carbuncleLastTestCaseSucceeded'));
  });
});
