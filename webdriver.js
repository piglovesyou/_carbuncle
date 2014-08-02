var _ = require('underscore');
var webdriver = require('selenium-webdriver');

var context = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();

context.get('http://yan-yan-yahuoku.com');
// context.get('http://www.google.com');

context.findElement(webdriver.By.css('.button-tag .button-remove')).click();
context.findElement(webdriver.By.css('body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.tag-input div.tag-input-leftcontent:nth-child(2) input.tag-input-textbox')).sendKeys('AKB' + webdriver.Key.ENTER);



context.wait(function() {
  return context.isElementPresent(webdriver.By.css('body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.goog-splitpane:nth-child(2) div.goog-splitpane-first-container div.goog-list.pane-list.goog-splitpane-first-container div.goog-list-container:nth-child(2) div.pure-g.pane-list-item.goog-list-item div.pure-u-18-24:nth-child(2) div.pane-list-item-title'));
}, 200);

context.findElement(webdriver.By.css('body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.goog-splitpane:nth-child(2) div.goog-splitpane-first-container div.goog-list.pane-list.goog-splitpane-first-container div.goog-list-container:nth-child(2) div.pure-g.pane-list-item.goog-list-item div.pure-u-18-24:nth-child(2) div.pane-list-item-title')).getText().then(function(text) {
  console.log(arguments, '======');
  return;
});

context.quit();

