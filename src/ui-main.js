const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const routes = require('./routes');

Router.run(routes, function(Handler) {
  ReactDOM.render(<Handler />, document.body);
});

