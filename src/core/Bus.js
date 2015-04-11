
var EventEmitter = require('events').EventEmitter;
var Executor = require('../services/Executor');
var assign = require('object-assign');

var Bus = assign({}, EventEmitter.prototype, {
  preview(scenario.entries, opt_interval) {

    var executor = new Executor(scenario.entries, opt_interval);
    executor.on('before', entry => {
      app.bus.scenario.publish('before', {
        scenario: scenario,
        entry: entry
      });
    });
    executor.on('pass', () => {
      app.bus.scenario.publish('pass', {
        scenario: scenario
      });
    });
    executor.on('fail', e => {
      app.bus.scenario.publish('fail', {
        scenario: scenario,
        error: e,
        stack: e.stack
      });
    });
    executor.on('end', function() {
      if (error) {
        res.json({error: error, stack: error.stack});
      } else {
        res.json({success: true});
      }
    });
  }
});
module.exports = Bus;
