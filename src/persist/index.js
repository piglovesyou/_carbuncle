const Q = require('q');
Q.longStackSupport = true;
const Auth = require('./auth');
const Actions = require('../actions');

const {PER_PAGE} = require('../constants');

module.exports = {
  saveScenario,
  deleteScenario,
  getScenarios,
  getScenario
};


function deleteScenario(id) {
  return getScenariosCollection()
  .then(scenarios =>
    Q.ninvoke(scenarios, 'deleteOne', { _id: id }));
}

function getScenario(id) {
  return getScenariosCollection()
  .then(scenarios =>
    Q.ninvoke(scenarios, 'findOne', { _id: id }));
}

function getScenarios(page, filter) {
  const skip = PER_PAGE * page;
  const limit = PER_PAGE;
  return getScenariosCollection()
  .then(scenarios => {
    return Q.all([
      Q.ninvoke(scenarios, 'count', filter),
      Q.ninvoke(scenarios.find(filter).skip(skip).limit(limit), 'toArray')
    ])
    .then(result => {
      const [total, docs] = result;
      return { docs, page, skip, limit, total };
    });
  });
}

function saveScenario(scenario) {
  return getScenariosCollection()
  .then(scenarios => {
    scenario.updatedBy = global.window.localStorage.username;
    if (scenario._id) {
      return Q.ninvoke(scenarios, 'updateOne', {_id: scenario._id}, scenario, {upsert: true})
      .then(rv => {
        Actions.notify({
          icon: 'check',
          message: 'シナリオ' + (scenario.title ? '「' + goog.string.truncate(scenario.title, 20) + '」' : '') + 'を保存しました',
          type: 'info'
        });
        return rv;
      });
    } else {
      return Q.ninvoke(scenarios, 'insertOne', scenario);
    }
  });
}

function getScenariosCollection() {
  return Auth.authenticate()
  .then(db => db.collection('scenarios'));
}
