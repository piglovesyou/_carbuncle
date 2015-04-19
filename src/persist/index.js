var Q = require('q');
Q.longStackSupport = true;
var Auth = require('./auth');

var PER_PAGE = 20;

module.exports = {
  saveScenario,
  getScenarios
};



function getScenarios(page) {
  var skip = PER_PAGE * page;
  var limit = PER_PAGE;
  return getScenariosCollection()
  .then(scenarios => {
    return Q.all([
      Q.ninvoke(scenarios, 'count'),
      Q.ninvoke(scenarios.find().skip(skip).limit(limit), 'toArray')
    ])
    .then(result => {
      var [total, docs] = result;
      return { docs, page, skip, limit, total };
    });
  });
}

function saveScenario(scenario) {
  return getScenariosCollection()
  .then(scenarios => {
    if (scenario._id) {
      return Q.ninvoke(scenarios, 'updateOne', {_id: scenario._id}, scenario, {upsert: true});
    } else {
      return Q.ninvoke(scenarios, 'insertOne', scenario);
    }
  });
}

function getScenariosCollection() {
  return Auth.authenticate()
  .then(db => db.collection('scenarios'));
}
