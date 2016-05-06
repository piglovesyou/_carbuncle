import assert from 'power-assert';
import {CHROMEDRIVER_PORT} from '../../src/const';
import childProcess from 'child_process';
import {WebDriver, By, Key, until} from 'selenium-webdriver';
import HttpUtil from 'selenium-webdriver/http/util';
import Http from 'selenium-webdriver/http';
import Chrome from 'selenium-webdriver/chrome';
import {Command, Name} from 'selenium-webdriver/lib/command';

export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getDriver() {
  await waitForDriverGetsReady();
  const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
  const sessions = await executor.execute(new Command(Name.GET_SESSIONS));
  assert(sessions.length > 0);
  return WebDriver.attachToSession(executor, sessions[0].id);
}

export async function waitForDriverGetsReady() {
  return await HttpUtil.waitForServer(`http://127.0.0.1:${CHROMEDRIVER_PORT}`, 10 * 1000);
}

export async function launchCarbuncle() {
  childProcess.fork('./src/main', [], {
    env: Object.assign({ NODE_ENV: 'production' }, process.env),
  });
  return await waitForDriverGetsReady();
}
