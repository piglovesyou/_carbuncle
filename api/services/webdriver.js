var assert = require('assert');
var webdriver = require('selenium-webdriver');
global.goog = require('closure').Closure({ CLOSURE_BASE_PATH: 'libs/closure-library/closure/goog/' });
goog.require('goog.string');
var Q = require('q');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Url = require('url');



module.exports.Executor = Executor;



/**
 * @constructor
 */
function Executor(entries, opt_interval) {
  EventEmitter.call(this);
  Object.defineProperty(this, 'entries', { value: entries });
  Object.defineProperty(this, 'interval', { value: opt_interval || 0 });
  Object.seal(this);
  this.execute_();
}
util.inherits(Executor, EventEmitter);

Executor.prototype.execute_ = function() {
  var that = this;
  var context = new Context;
  // Not return promise for preventing confusing
  this.entries.reduce(function(p, e) {
    return p.then(function() {
      that.emit('before', e);
      return executionMap[e.mode][e.type](context, e.css, e.text);
    }).delay(that.interval);
  }, Q())
  .then(function() {
    that.emit('pass');
    context.quit();
    that.emit('end');
    return context;
  })
  .catch (function(e) {
    that.emit('error', e);
    context.quit(); // Make sure to quit even if an error occures.
    that.emit('end', e);
    // throw new Error(e);
  })
};




/**
 * executionMap[mode][type](css, text)
 */
var executionMap = {
	action: {
		open: actionOpen,
		click: actionClick,
		input: actionInput
	},
	verify: {
		equal: verify.bind(null, 'equal'),
		contains: verify.bind(null, 'contains'),
		startsWith: verify.bind(null, 'startsWith'),
		endsWith: verify.bind(null, 'endsWith')
	}
};




function actionOpen(context, noUse, url) {
  var u = Url.parse(url);
  var dest = global.options.site + (u.pathname || '');
	return context.open(dest);
}
function actionClick(context, css) {
	return context.wait(css).then(function() {
    return context.find(css).click().then(function() {
		  return context;
		});
	});
}
function actionInput(context, css, input) {
	return context.wait(css).then(function() {
		return context.find(css).sendKeys(replaceMetaKey(input));
	});
}
function verify(type, context, css, text) {
	var method = mapVerifyMethod(type);
	return context.wait(css).then(function() {
		return context.find(css).getText().then(function(v) {
			assert(method(v, text));
		});
	});
}




/**
 * @constructor
 */
function Context() {
  Object.defineProperty(this, 'driver_', {
    value: new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build()
  });
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
  return input.replace(/(\{.*?\})/g, function (hit) {
    var content = hit.match(/\{(.*?)\}/);
    if (content && webdriver.Key[content[1]]) {
      return webdriver.Key[content[1]];
    }
    return hit;
  });
}
