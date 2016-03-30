const {WebDriver, By} = require('selenium-webdriver');
const Http = require('selenium-webdriver/http');
const Command = require('selenium-webdriver/lib/command');
const {CHROMEDRIVER_PORT, DRIVER_TARGET_ID} = require('../const');

const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
let sessionId;

module.exports = {
  get,
  getDefaultContent
};

async function get() {
  const driver = await getDriver();
  const frameEl = await driver.findElement(By.id(DRIVER_TARGET_ID)).then(el => el);
  await driver.switchTo().frame(frameEl);
  return driver;
}

async function getDefaultContent() {
  const driver = await getDriver();
  await driver.switchTo().defaultContent();
  return driver;
}

async function getDriver() {
  const session = await findSession();
  return WebDriver.attachToSession(executor, session.id);
}

async function findSession() {
  if (sessionId) {
    return sessionId;
  }
  var command = new Command.Command(Command.Name.GET_SESSIONS);
  const json = await executor.execute(command);
  if (!json || !json.value || !json.value[0]) {
    throw new Error('Cannot find session');
  }
  return sessionId = json.value[0];
}
