const {render} = require('react-dom');
const routes = require('./routes');
const Driver = require('./core/driver');

render(routes, document.getElementById('application-container'));

const win = require('nw.gui').Window.get();
win.moveTo(200, 150);
// win.showDevTools();

win.on('close', async () => {
  const driver = await Driver.getDefaultContent();
  await timeout(400); // I don't know why I need this timeout to close stablly
  // We don need to call `driver.close()`, let nw.js close its window by itself.
  driver.quit().thenFinally(() => {
    win.close(true);
  });
  // TODO: `chromedriver` process still exists. How do we terminate it from nw?
});

// Only for development purpose
const {WebDriver, By, Key, until} = require('selenium-webdriver');
const {timeout, showDevTools, closeDevTools} = require('./util');
const assert = require('power-assert');
(async () => {
  // return;
  try {
    await timeout(800);
    await showDevTools();
    var driver = await Driver.getDefaultContent();

    // Start recording
    await driver.findElement(By.css('.browser__rec-btn')).click();

    // Open web site
    await driver.findElement(By.css('.browser_location-input')).sendKeys('http://www.google.com/ncr');
    await driver.findElement(By.css('.browser_location-input')).sendKeys(Key.ENTER);

    driver = await Driver.get();
    await driver.findElement(By.name('q')).sendKeys('carbuncle');
    await driver.findElement(By.name('q')).sendKeys(Key.ENTER);
    driver = await Driver.getDefaultContent();
    await driver.findElement(By.css('.step-adder__verify')).click();
    await timeout(400);
    driver = await Driver.get();
    await timeout(400);
    await driver.findElement(By.css('.g h3')).click();
    await timeout(400);
    driver = await Driver.getDefaultContent();
    await timeout(400);
    await driver.findElement(By.css('.palette__playback-btn')).click();

    // 
    // await driver.findElement(By.css('.browser__rec-btn')).click();
    // await driver.findElement(By.css('.browser_location-input')).sendKeys('http://passwordsgenerator.net/md5-hash-generator/');
    // await driver.findElement(By.css('.browser_location-input')).sendKeys(Key.ENTER);
    // var driver = await Driver.get();
    // var txt1ElPromise = driver.findElement(By.css('#txt1'));
    // txt1ElPromise.sendKeys('abc');
    // var txt1El = await txt1ElPromise.then(el => el);

    // return;
    // await timeout(800);
    // await showDevTools();
    // await timeout(800);
    // debugger;
    // var driver = await Driver.getDefaultContent();
    // await driver.findElement(By.css('.step-adder__verify')).click();
    // // "StaleElementReferenceError"
    // await driver.actions()
    //   .mouseMove(txt1El, {x: 10, y: 10})
    //   .click(txt1El)
    //   .perform();

    // await showDevTools();
    
  } catch(e) {
    await showDevTools();
    await timeout(800);
    debugger;
  }

})();
