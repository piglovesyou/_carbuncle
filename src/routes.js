const React = require('react');
const { Router, Route, IndexRoute, NotFoundRoute, Link, hashHistory } = require('react-router');
const Root = require('./components/Root');
const Dashboard = require('./components/Dashboard');
const TestCases = require('./components/Dashboard/TestCases');
const Setting = require('./components/Dashboard/Setting');

module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={Root}>
      <Route path='dashboard' component={Dashboard}>
        <IndexRoute component={TestCases}/>
        <Route path='setting' component={Setting} />
      </Route>
    </Route>
  </Router>
);
