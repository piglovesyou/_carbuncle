
var Q = require('q');
var fs = require('fs');
var readFile = Q.denodeify(fs.readFile);
var http = require('http');
var mime = require('mime');

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();


http.createServer(function(req, res) {

  if (~req.url.indexOf('/worm')) {

    var url = (req.url == '/worm' || req.url == '/worm/') ?
      '/worm/index.html' : req.url;
    res.setHeader('Content-Type', mime.lookup(url) + ';charset=UTF-8');

    readFile(__dirname + '/public' + url)
    .then(function(content) { res.end(content) })
    .fail(function(e) { console.log(e.stack) });

  } else if (~req.url.indexOf('favicon'))
    res.end();
  else
    proxy.web(req, res, { target: 'http://yan-yan-yahuoku.com' });

}).listen(3000);

