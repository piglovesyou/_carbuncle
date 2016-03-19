const {render} = require('react-dom');
const routes = require('./routes');
render(routes, document.getElementById('application-container'));

const {WebDriver} = require('selenium-webdriver');
const Http = require('selenium-webdriver/http');
const Command = require('selenium-webdriver/lib/command');
const {CHROMEDRIVER_PORT} = require('./constants');

// const remote = require('selenium-webdriver/remote');
// const Chrome = require('selenium-webdriver/chrome');

const win = require('nw.gui').Window.get();
win.moveTo(200, 150);
win.showDevTools();
const executor = new Http.Executor(new Http.HttpClient(`http://127.0.0.1:${CHROMEDRIVER_PORT}`));
var command = new Command.Command(Command.Name.GET_SESSIONS);
executor.execute(command).then(json => {
  if (!json || !json.value || !json.value[0]) {
    return Promise.reject(new Error('Cannot find session'));
  }

  const sessionId = json.value[0].id;
  const driver = WebDriver.attachToSession(executor, sessionId);

  win.on('close', () => {
    driver.switchTo().defaultContent();
    // We don need to call `driver.close()`, let nw.js close its window by itself.
    driver.quit().thenFinally(() => win.close(true));
    // TODO: `chromedriver` process still exists. How do we terminate it from nw?
  });

  // driver.getWindowHandle().then(handle => {
  //   win.on('close', () => {
  //     win.hide();
  //     console.log('window closing');
  //     driver.switchTo().defaultContent();
  //     driver.quit().then(() => {
  //       console.log('xxxxxxxxxxxxxxx')
  //       // this.close(true);
  //       // process.exit();
  //     });
  //   });
  // });
  // driver.switchTo().frame(driver.findElement(By.css('.iframe__iframe')));

  // const iframe = document.querySelector('.iframe__iframe');
  // iframe.src = 'http://www.google.com/ncr';
  // iframe.onload = e => {
  //   console.log('iframe loaded');
  //   setTimeout(() => {
  //     driver.findElement(By.name('q')).sendKeys('blaaaaa');
  //   }, 2000);
  // };
}).catch(reason => {
  console.log('Cannot find chromedriver', reason);
});
