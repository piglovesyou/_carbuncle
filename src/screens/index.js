const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');

const Browser = require('../components/Browser');
const Palette = require('../components/Palette');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Index extends React.Component {
  render() {
    return (
      <div className="screens-index">
        <Browser location="http://www.google.com/ncr"
          onMenuButtonClick={() => hashHistory.push('/dashboard/')}
        />
        <Palette />
      </div>
    );
  }
}

module.exports = Index;
