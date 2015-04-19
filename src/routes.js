var React = require('react');
var Router = require('react-router');
var {
  Route,
  NotFoundRoute,
  RouteHandler
} = Router;
var Index = require('./applications');
var Setting = require('./applications/setting');
var Scenarios = require('./applications/scenarios');
var Path = require('path');



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
    <Route handler={Index} name="index" path={Path.resolve(__dirname, '/')} />
    <Route handler={Scenarios} name="scenarios" path={Path.resolve(__dirname, '/scenarios')} />
    <Route handler={Setting} name="setting" path={Path.resolve(__dirname, '/setting')} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
