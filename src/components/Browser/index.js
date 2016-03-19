const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');

const Browser = require('./Browser');
const Palette = require('./Palette');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Index extends React.Component {
  render() {
    return (
      <div className="screens-index">
        <Browser location="http://www.google.com/ncr" />
        <Palette />
      </div>
    );
  }
}

module.exports = Index;