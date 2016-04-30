import {render} from 'react-dom';
import routes from './routes';
import Driver from './core/driver';

render(routes, document.getElementById('application-container'));

const win = require('nw.gui').Window.get();
win.moveTo(0, 20);
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
import {WebDriver, By, Key, until} from 'selenium-webdriver';
import {timeout, showDevTools, closeDevTools} from './util';
import assert from 'power-assert';
(async () => {
  // return;
  try {
    await timeout(800);
    await showDevTools();
    var driver = await Driver.getDefaultContent();

    // Start recording
    await driver.findElement(By.css('.browser__rec-btn')).click();

    // Open web site
    await driver.findElement(By.css('.browser__location-input input')).sendKeys('http://www.google.com/ncr');
    await driver.findElement(By.css('.browser__location-input input')).sendKeys(Key.ENTER);

    driver = await Driver.get();
    await driver.findElement(By.name('q')).sendKeys('carbuncle');
    await driver.findElement(By.name('q')).sendKeys(Key.ENTER);
    driver = await Driver.getDefaultContent();
    await driver.findElement(By.css('.step-adder__verify')).click();
    await timeout(400);
    driver = await Driver.get();
    // await timeout(400);
    await driver.findElement(By.css('.g h3')).click();
    // await timeout(400);
    driver = await Driver.getDefaultContent();
    await timeout(400);
    await driver.findElement(By.css('.palette__playback-btn')).click();

    // 
    // await driver.findElement(By.css('.browser__rec-btn')).click();
    // await driver.findElement(By.css('.browser__location-input')).sendKeys('http://passwordsgenerator.net/md5-hash-generator/');
    // await driver.findElement(By.css('.browser__location-input')).sendKeys(Key.ENTER);
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
