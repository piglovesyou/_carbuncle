var React = require('react');
var Router = require('react-router');
var {
  Route,
  NotFoundRoute,
  RouteHandler
} = Router;
var Index = require('./applications');
var Setting = require('./applications/setting');
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
    <Route handler={Index} name="index" path={Path.resolve(__dirname, 'index')} />
    <Route handler={Index} name="landed" path={Path.resolve(__dirname, 'index.html')} />
    <Route handler={Setting} name="setting" path={Path.resolve(__dirname, 'setting')} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
