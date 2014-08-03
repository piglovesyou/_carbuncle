var assert = require('assert');
var webdriver = require('selenium-webdriver');
global.goog = require('closure').Closure({ CLOSURE_BASE_PATH: 'libs/closure-library/closure/goog/' });
goog.require('goog.string');
var Q = require('q');



var context = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();


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



var seed = {
	title: 'xxx',
	entries: [
		{mode: 'action', type: 'open', text: 'http://yan-yan-yahuoku.com'},
		{mode: 'action', type: 'click', css: '.button-tag .button-remove'},
		{mode: 'action', type: 'input', css: 'body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.tag-input div.tag-input-leftcontent:nth-child(2) input.tag-input-textbox', text: 'AKB' + webdriver.Key.ENTER},
		{mode: 'verify', type: 'contains', css: 'body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.goog-splitpane:nth-child(2) div.goog-splitpane-first-container div.goog-list.pane-list.goog-splitpane-first-container div.goog-list-container:nth-child(2) div.pure-g.pane-list-item.goog-list-item div.pure-u-18-24:nth-child(2) div.pane-list-item-title', text: 'AKB'}
	]
};



seed.entries.reduce(function(p, e) {
	return p.then(function() {
		return executionMap[e.mode][e.type](e.css, e.text);
	});
}, Q())
.catch (function(e) {
	console.log(e.stack);
})
.done(function() {
	context.quit();
});



function actionOpen(noUse, url) {
	return context.get(url);
}
function actionClick(css) {
	return waitElemnet(css).then(function() {
		return context.findElement(webdriver.By.css(css)).click();
	});
}
function actionInput(css, input) {
	return waitElemnet(css).then(function() {
		return context.findElement(webdriver.By.css(css)).sendKeys(input);
	});
}
function verify(type, css, text) {
	var method = mapVerifyMethod(type);
	return waitElemnet(css).then(function() {
		return context.findElement(webdriver.By.css(css)).getText().then(function(v) {
			assert(method(v, text));
		});
	});
}



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
function waitElemnet(selector) {
	return context.wait(function() {
		return context.isElementPresent(webdriver.By.css(selector));
	}, 1000);
}
