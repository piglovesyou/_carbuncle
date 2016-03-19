const React = require('react');
const { Router, Route, IndexRoute, NotFoundRoute, Link, hashHistory } = require('react-router');
const Browser = require('./screens/Browser');
const Dashboard = require('./screens/Dashboard');
const DashboardIndex = require('./screens/Dashboard/Index');
const DashboardSetting = require('./screens/Dashboard/Setting');

module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={Browser} />
    <Route path='/dashboard' component={Dashboard}>
      <IndexRoute component={DashboardIndex}/>
      <Route path='setting' component={DashboardSetting} />
    </Route>
    <Route path='*' component={NotFoundRoute} />
  </Router>
);
