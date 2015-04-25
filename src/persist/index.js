var Q = require('q');
Q.longStackSupport = true;
var Auth = require('./auth');

var {PER_PAGE} = require('../constants');

module.exports = {
  saveScenario,
  deleteScenario,
  getScenarios
};



function deleteScenario(id) {
  return getScenariosCollection()
  .then(scenarios =>
    Q.ninvoke(scenarios, 'deleteOne', { _id: id }));
}

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
    scenario.updatedBy = global.window.localStorage.username;
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
