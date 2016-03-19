const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Dashboard extends React.Component {
  render() {
    return (
      <div className="screens-dashboard">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Dashboard;

