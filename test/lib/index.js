import assert from 'assert';
import {CHROMEDRIVER_PORT, DRIVER_TARGET_ID} from '../../src/const';
import childProcess from 'child_process';
import {WebDriver, By, Key, until} from 'selenium-webdriver';
import HttpUtil from 'selenium-webdriver/http/util';
import Http from 'selenium-webdriver/http';
import Chrome from 'selenium-webdriver/chrome';
import {Command, Name} from 'selenium-webdriver/lib/command';
import Q from 'q';
import getpid_ from 'getpid';
const getpid = Q.denodeify(getpid_);
import kill_ from 'tree-kill';
const kill = Q.denodeify(kill_);

export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function switchToDefaultContent(driver) {
  await driver.switchTo().defaultContent();
}

export async function switchToFrame(driver) {
  await driver.switchTo().defaultContent();
  const frameEl = await driver.findElement(By.id(DRIVER_TARGET_ID)).then(el => el);
  await driver.switchTo().frame(frameEl);
}

export async function getDriver() {
  await waitForDriverGetsReady();
  const sessions = await getSessions();
  assert.equal(sessions.length, 1);
  const executor = getExecutor();
  return WebDriver.attachToSession(executor, sessions[0].id);
}

export async function launchCarbuncle() {
  childProcess.fork('./src/main', [], {
    env: Object.assign({ NODE_ENV: 'production' }, process.env),
  });
  await waitForDriverGetsReady();
}

export async function terminateAll() {
  do {
    for (let name of ['carbuncle', 'chromedriver', 'nw']) {
      const pid = await getpid(name);
      if (pid) await kill(pid, null);
    }
  } while ((await getpid('carbuncle')) ||
           (await getpid('chromedriver')) ||
           (await getpid('nw')));
}


async function waitForDriverGetsReady() {
  await HttpUtil.waitForServer(`http://127.0.0.1:${CHROMEDRIVER_PORT}`, 10 * 1000);
  while ((await getSessions()).length <= 0 ||
         !(await getpid('carbuncle')) ||
         !(await getpid('chromedriver')) ||
         !(await getpid('nw'))) await timeout(200);
}

async function getSessions() {
  const executor = getExecutor();
  return await executor.execute(new Command(Name.GET_SESSIONS));
}

function getExecutor() {
  return new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
}
