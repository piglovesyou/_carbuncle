
var assert = require('assert');
var Options = require('../helpers').Options;
var webdriver = require('selenium-webdriver');
var Executor = require('../src/services/carbuncle').Executor;

describe('carbuncle.js', function() {

  global.options = new Options({ site: 'http://www.google.com' });

  describe('Passing Executor', function() {
    this.timeout(5000);
    it('should pass', function(done) {
      var passed;
      var seed = {
        title: 'Passing Executor Example',
        entries: [
          {title: 'open website', mode: 'action', type: 'open', text: 'http://www.google.com/'},
          {title: 'input search text', mode: 'action', type: 'input', css: '#gbqfq', text: 'ゴミメガネ' + webdriver.Key.ENTER},
          {title: 'verify whether any item was loaded', mode: 'verify', type: 'contains', css: '#ires', text: '本間'}
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
        title: 'Failing Executor Example',
        entries: [
          {title: 'open website', mode: 'action', type: 'open', text: 'http://www.google.com/'},
          {title: 'input search text', mode: 'action', type: 'input', css: '#gbqfq', text: 'm' + webdriver.Key.ENTER},
          {title: 'verify whether any item was loaded', mode: 'verify', type: 'contains', css: '#ires', text: '本間'}
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
