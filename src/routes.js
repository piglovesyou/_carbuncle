const React = require('react');
const Router = require('react-router');
const {
  Route,
  NotFoundRoute,
  RouteHandler
} = Router;
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
  <Route handler={RootApp}>
    <Route handler={Index} name='index' path='/' />
    <Route handler={ScenarioList} name='scenario-list' path='scenario-list' />
    <Route handler={Setting} name='setting' path='setting' />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
