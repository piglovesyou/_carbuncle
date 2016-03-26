const {WebDriver, By} = require('selenium-webdriver');
const Http = require('selenium-webdriver/http');
const Command = require('selenium-webdriver/lib/command');
const {CHROMEDRIVER_PORT, DRIVER_TARGET_ID} = require('../const');

const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
let driverInstance;
let isDriverTargetFocused;

module.exports = {
  get,
  getDefaultContent
};

async function get() {
  const driver = await getDriver();
  if (isDriverTargetFocused === true) {
    return driver;
  }
  isDriverTargetFocused = true;
  const frameEl = await driver.findElement(By.id(DRIVER_TARGET_ID)).then(el => el);
  await driver.switchTo().frame(frameEl);
  return driver;
}

async function getDefaultContent() {
  const driver = await getDriver();
  if (isDriverTargetFocused === false) {
    return driver;
  }
  isDriverTargetFocused = false;
  return await driver.switchTo().defaultContent();
}

async function getDriver() {
  if (driverInstance) {
    return driverInstance;
  }
  isDriverTargetFocused = false;
  const session = await findSession();
  return driverInstance = WebDriver.attachToSession(executor, session.id);
}

async function findSession() {
  var command = new Command.Command(Command.Name.GET_SESSIONS);
  const json = await executor.execute(command);
  if (!json || !json.value || !json.value[0]) {
    throw new Error('Cannot find session');
  }
  return json.value[0];
}
