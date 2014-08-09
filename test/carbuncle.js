
var assert = require('assert');
var Options = require('../helpers').Options;
var webdriver = require('selenium-webdriver');
var Executor = require('../api/services/carbuncle').Executor;

describe('carbuncle.js', function() {

  global.options = new Options({ site: 'http://yan-yan-yahuoku.com' });

  describe('Passing Executor', function() {
    this.timeout(5000);
    it('should pass', function(done) {
      var passed;
      var seed = {
      	title: 'xxx',
      	entries: [
      		{title: 'open website', mode: 'action', type: 'open', text: '/'},
      		{title: 'remove extra tag', mode: 'action', type: 'click', css: '.button-tag .button-remove'},
      		{title: 'input search text', mode: 'action', type: 'input', css: 'body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.tag-input div.tag-input-leftcontent:nth-child(2) input.tag-input-textbox', text: 'AKB' + webdriver.Key.ENTER},
      		{title: 'verify whether any item was loaded', mode: 'verify', type: 'contains', css: 'body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.goog-splitpane:nth-child(2) div.goog-splitpane-first-container div.goog-list.pane-list.goog-splitpane-first-container div.goog-list-container:nth-child(2) div.pure-g.pane-list-item.goog-list-item div.pure-u-18-24:nth-child(2) div.pane-list-item-title', text: 'AKB'}
      	]
      };
      var executor = new Executor(seed.entries);
      executor.on('before', function(entry) { console.log('before ' + entry.title + ' ...') });
      executor.on('pass', function() { passed = true });
      executor.on('fail', function(e) { passed = false });
      executor.on('end', function() {
        assert(passed === true);
        setTimeout(done, 100);
      });
    });
  });
  describe('Failing Executor', function() {
    this.timeout(5000);
    it('should fail', function(done) {
      var passed;
      var seed = {
      	title: 'xxx',
      	entries: [
      		{title: 'open website', mode: 'action', type: 'open', text: '/'},
      		{title: 'remove extra tag', mode: 'action', type: 'click', css: '.button-tag .button-remove'},
      		{title: 'input search text', mode: 'action', type: 'input', css: 'body:nth-child(2) div.body:nth-child(2) div.frame.app-frame-selected div.tag-input div.tag-input-leftcontent:nth-child(2) input.tag-input-textbox', text: 'AKB' + webdriver.Key.ENTER},
      		{title: 'verify whether any item was loaded', mode: 'verify', type: 'contains', css: 'xxxxxx', text: 'AKB'}
      	]
      };
      var executor = new Executor(seed.entries);
      executor.on('before', function(entry) { console.log('before ' + entry.title + ' ...') });
      executor.on('pass', function() { passed = true });
      executor.on('fail', function(e) { passed = false });
      executor.on('end', function() {
        assert(passed === false);
        setTimeout(done, 100);
      });
    });
  });
});
