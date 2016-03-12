const React = require('react');
const { Router, Route, NotFoundRoute, hashHistory } = require('react-router');
const Index = require('./applications');
const Setting = require('./applications/Setting');
const ScenarioList = require('./applications/ScenarioList');


module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={Index} />
    <Route path='/scenario-list' component={ScenarioList} />
    <Route path='/setting' component={Setting} />
    <Route path='*' component={NotFoundRoute} />
  </Router>
);
