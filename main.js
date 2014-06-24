

var SELENIUM_JAR_PATH = './libs/selenium/selenium-server-standalone-2.42.2.jar';


var Q = require('q');
var fs = require('fs');
var readFile = Q.denodeify(fs.readFile);
var http = require('http');
var mime = require('mime');
var url = require('url');

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;



// var server = new SeleniumServer(SELENIUM_JAR_PATH, {
//   port: 4444
// });
// server.start();
// var driver = new webdriver.Builder().
//     usingServer(server.address()).
//     withCapabilities(webdriver.Capabilities.firefox()).
//     build();
// driver.get('http://google.com');
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(webdriver.By.name('btnK')).click();
// driver.wait(function() {
//  return driver.getTitle().then(function(title) {
//    return title === 'webdriver - Google 検索';
//  });
// }, 2000);
// driver.quit();




http.createServer(function(req, res) {

  if (~req.url.indexOf('/worm')) {
    
    var path = (req.url == '/worm' || req.url == '/worm/') ?
      '/worm/index.html' :
      url.parse(req.url).pathname;
    res.setHeader('Content-Type', mime.lookup(path) + ';charset=UTF-8');

    readFile(__dirname + '/public' + path)
    .then(function(content) { res.end(content) })
    .fail(function(e) { console.log(e.stack) });

  } else if (~req.url.indexOf('favicon'))
    res.end();
  else
    proxy.web(req, res, { target: 'http://yan-yan-yahuoku.com' });

}).listen(3000);

