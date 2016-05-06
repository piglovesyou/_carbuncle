import assert from 'power-assert';
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
import {timeout, waitForDriverGetsReady, getDriver, launchCarbuncle} from './lib';

describe('Carbuncle', () => {
  it('should correctly launch and halt', async function () {
    this.timeout(5000);

    await launchCarbuncle();
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
});
