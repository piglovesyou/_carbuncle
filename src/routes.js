const React = require('react');
const { Router, Route, NotFoundRoute, RouteHandler, hashHistory } = require('react-router');
const Index = require('./applications');
const Setting = require('./applications/Setting');
const ScenarioList = require('./applications/ScenarioList');


const RootApp = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
      <RouteHandler />
    );
  }
});

const NotFound = React.createClass({
  render: function() {
    return <h2>Not found</h2>;
  }
});

module.exports = (
  <Router history={hashHistory}>
    <Route path="/" component={Index} />
    <Route path="/scenario-list" component={ScenarioList} />
    <Route path="/setting" component={Setting} />
    <Route path="*" component={NotFound} />
  </Router>
);
