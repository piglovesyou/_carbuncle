
goog.provide('app.bus');

goog.require('goog.pubsub.PubSub');


goog.scope(function() {

var Executor = require('./api/services/carbuncle').Executor;

app.bus = {};

app.bus.scenario = new goog.pubsub.PubSub;

app.bus.scenario.preview = function(scenario, opt_interval) {

  var executor = new Executor(scenario.entries, opt_interval);
  executor.on('before', function(entry) {
    app.bus.scenario.publish('before', {
      scenario: scenario,
      entry: entry
    });
  });
  executor.on('pass', function() {
    app.bus.scenario.publish('pass', {
      scenario: scenario
    });
  });
  executor.on('fail', function(e) {
    app.bus.scenario.publish('fail', {
      scenario: scenario,
      error: e,
      stack: e.stack
    });
  });
  // executor.on('end', function() {
  //   if (error) {
  //     res.json({error: error, stack: error.stack});
  //   } else {
  //     res.json({success: true});
  //   }
  // });
};

}); // goog.scope
