const Path = require('path');
const Os = require('os');
const HttpUtil = require('selenium-webdriver/http/util');
const ChildProcess = require('child_process');
const Wd = require('selenium-webdriver');
const Http = require('selenium-webdriver/http');
const Chrome = require('selenium-webdriver/chrome');
const FS = require('fs');
const {PROCESS_NAME, CHROMEDRIVER_PORT} = require('./const');

process.title = PROCESS_NAME;

const command = Path.resolve(__dirname, '../executables/chromedriver');
const child = ChildProcess.spawn(command, [`--port=${CHROMEDRIVER_PORT}`], {
  env: process.env,
  stdio: [ null, 'pipe', 'pipe' ],
});
child.stdout.pipe(FS.createWriteStream(Path.resolve(__dirname, '../chromedriver-stdout.log'), {flags: 'a'}));
child.stderr.pipe(FS.createWriteStream(Path.resolve(__dirname, '../chromedriver-stderr.log'), {flags: 'a'}));

HttpUtil.waitForServer(`http://127.0.0.1:${CHROMEDRIVER_PORT}`, 10 * 1000)
.then(() => {
  const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
  const options = new Chrome.Options();
  options.addArguments(`nwapp=${Path.resolve(__dirname, '..')}`);
  options.addArguments(`user-data-dir=${getDataPath()}`);
  return Wd.WebDriver.createSession(executor, options.toCapabilities());
});

// Is there a way to call `require('nw.gui').App.dataPath` ?
// https://github.com/nwjs/nw.js/blob/nw14/src/api/app/app.js#L129
function getDataPath() {
  return Path.join(Os.homedir(), '.config/carbuncle');
}
