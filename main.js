var app = require('app');
var BrowserWindow = require('browser-window');
var Path = require('path');
var Url = require('url');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 768, top: 40, left: 40});

  mainWindow.loadUrl(Path.join('file://', __dirname, 'dist/index.html'));
  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
