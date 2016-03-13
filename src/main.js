const Path = require('path');
const HttpUtil = require('selenium-webdriver/http/util');
const ChildProcess = require('child_process');
const Wd = require('selenium-webdriver');
const Http = require('selenium-webdriver/http');
const Chrome = require('selenium-webdriver/chrome');
const FS = require('fs');

const PORT = 9157;

const command = Path.resolve(__dirname, '../executables/chromedriver');
const options = new Chrome.Options();
options.addArguments(`nwapp=${Path.resolve(__dirname, '..')}`);

const child = ChildProcess.spawn(command, [`--port=${PORT}`], {
  env: process.env,
  stdio: [ null, 'pipe', 'pipe' ],
  detached: true
});
child.stdout.pipe(FS.createWriteStream(Path.resolve(__dirname, '../chromedriver-stdout.log'), {flags: 'a'}));
child.stderr.pipe(FS.createWriteStream(Path.resolve(__dirname, '../chromedriver-stderr.log'), {flags: 'a'}));

HttpUtil.waitForServer(`http://127.0.0.1:${PORT}`, 10 * 1000)
.then(() => {
  const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${PORT}`));
  return Wd.WebDriver.createSession(executor, options.toCapabilities());
})
.then(() => {
  process.exit(0);
});
