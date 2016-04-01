const React = require('react');
const { Router, Route, IndexRoute, NotFoundRoute, Link, hashHistory } = require('react-router');
const Root = require('./components/Root');
const Dashboard = require('./components/Dashboard');
const DashboardIndex = require('./components/Dashboard/Index');
const DashboardSetting = require('./components/Dashboard/Setting');

module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={Root}>
      <Route path='dashboard' component={Dashboard}>
        <IndexRoute component={DashboardIndex}/>
        <Route path='setting' component={DashboardSetting} />
      </Route>
    </Route>
  </Router>
);
