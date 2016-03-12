var assert = require('assert');
var FS = require('fs');
var Path = require('path');
var mkdirp = require('mkdirp');
var webdriver = require('selenium-webdriver');
// global.goog = require('closure').Closure({ CLOSURE_BASE_PATH: 'libs/closure-library/closure/goog/' });
// goog.require('goog.string');
var Q = require('q');
Q.longStackSupport = true;
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Url = require('url');



module.exports = Executor;



/**
 * @constructor
 */
function Executor(entries, opt_interval) {
  EventEmitter.call(this);
  Object.defineProperty(this, 'entries', { value: entries });
  Object.defineProperty(this, 'interval', { value: opt_interval || 0 });
  Object.defineProperty(this, 'context', { value: new Context });
  Object.seal(this);
  this.execute_();
}
util.inherits(Executor, EventEmitter);

Executor.prototype.execute_ = function() {
  var that = this;
  var context = this.context;
  that.scheduleEntries_(this.entries)
  .then(function() {
    that.emit('pass');
    context.quit();
    that.emit('end');
    return context;
  })
  .catch (function(e) {
    that.emit('fail', e);
    context.quit(); // Make sure to quit even if an error occures.
    that.emit('end', e);
    // throw new Error(e);
  });
};

Executor.prototype.scheduleEntries_ = function(entries) {
  var that = this;
  var context = this.context;
  return entries.reduce(function(p, e) {
    return p.then(function() {
      if (e.mode == 'block') {
        return Scenario.findOne(e.id)
        .then(function(doc) {
          assert(doc.isBlock, 'Wrong scenario was stored as a block.');
          that.emit('before', _.extend(doc, e));
          return that.scheduleEntries_(doc.entries);
        });
      } else {
        that.emit('before', e);
        return executionMap[e.mode][e.type](context, e);
      }
    }).delay(that.interval);
  }, Q());
};



/**
 * executionMap[mode][type](entry)
 */
var executionMap = {
  action: {
    open: actionOpen,
    click: actionClick,
    screenshot: actionScreenshot,
    input: actionInput
  },
  verify: {
    equal: verify.bind(null, 'equal'),
    contains: verify.bind(null, 'contains'),
    startsWith: verify.bind(null, 'startsWith'),
    endsWith: verify.bind(null, 'endsWith')
  }
};




function actionOpen(context, entry) {
  return context.open(Url.parse(entry.text).href);
}
function actionClick(context, entry) {
  return context.wait(entry.css).then(function() {
    return context.find(entry.css).click().then(function() {
      return context;
    });
  });
}
function actionScreenshot(context, entry) {
  var dir = Path.resolve(global.nwGui.App.dataPath, 'screenshot');
  var file = Path.resolve(dir, (entry.text || 'yeah') + '.png');
  return Q.nfcall(mkdirp, dir)
  .then(function() {
    return context.screenshot();
  })
  .invoke('replace', /^data:image\/png;base64,/, '')
  .then(function(data) {
    return Q.ninvoke(FS, 'writeFile', file, data, 'base64');
  })
  .then(function() {
    return context;
  });
}
function actionInput(context, entry) {
  return context.wait(entry.css).then(function() {
    return context.find(entry.css).sendKeys(replaceMetaKey(entry.text));
  });
}
function verify(type, context, entry) {
  var method = mapVerifyMethod(type);
  return context.wait(entry.css).then(function() {
    return context.find(entry.css).getText().then(function(v) {
      assert(method(v, entry.text));
    });
  });
}



/**
 * @constructor
 */
function Context() {
  Object.defineProperty(this, 'driver_', {
    value: new webdriver.Builder()
        // withCapabilities(webdriver.Capabilities.phantomjs()).
        .withCapabilities(webdriver.Capabilities.chrome())
        .build()
  });
  this.driver_.manage().window().setSize(800, 600);
  Object.seal(this);
}
Context.prototype.open = function(url) {
  return this.driver_.get(url);
};
Context.prototype.wait = function(selector) {
  var that = this;
  return that.driver_.wait(function() {
    return that.driver_.isElementPresent(webdriver.By.css(selector));
  }, 1000);
};
Context.prototype.find = function(css) {
  return this.driver_.findElement(webdriver.By.css(css));
};
Context.prototype.quit = function() {
  return this.driver_.quit();
};
Context.prototype.screenshot = function() {
  return this.driver_.takeScreenshot();
};




function mapVerifyMethod(type) {
  assert([
    'equal',
    'contains',
    'startsWith',
    'endsWith'
  ].some(function(s) {return s == type}));
  return type == 'equal' ?
    function(text, v) { return text == v } : goog.string[type];
}
function replaceMetaKey(input) {
  return input.replace(/(\{.*?\})/g, function(hit) {
    var content = hit.match(/\{(.*?)\}/);
    if (content && webdriver.Key[content[1]]) {
      return webdriver.Key[content[1]];
    }
    return hit;
  });
}
