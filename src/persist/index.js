
var Q = require('q');
var Auth = require('../auth');

module.exports.saveScenario = function(scenario) {
  return getScenarios()
  .then(scenarios => {
    var id = scenario._id;
    if (id) {
      return Q.ninvoke(scenarios, 'update', {_id: id}, scenario, {upsert: true});
    } else {
      return Q.ninvoke(scenarios, 'insert', scenario);
    }
  });
};

function getScenarios() {
  return Auth.getDB()
  .then(db => db.collection('scenarios'));
}
