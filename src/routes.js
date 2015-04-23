var React = require('react');
var Router = require('react-router');
var {
  Route,
  NotFoundRoute,
  RouteHandler
} = Router;
var Index = require('./applications');
var Setting = require('./applications/Setting');
var ScenarioList = require('./applications/ScenarioList');



var RootApp = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  render: function () {
    return (
      <RouteHandler store={this.props.store}/>
    );
  }
});

var NotFound = React.createClass({
  render: function () {
    return <h2>Not found</h2>;
  }
});

module.exports = (
  <Route handler={RootApp}>
    <Route handler={Index} name="index" path="/" />
    <Route handler={ScenarioList} name="scenario-list" path="scenario-list" />
    <Route handler={Setting} name="setting" path="setting" />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
