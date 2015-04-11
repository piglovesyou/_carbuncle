var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

require('node-jsx').install({ harmony: true });

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.body);
});
