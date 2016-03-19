
const React = require('react');
const {HistoryLocation} = require('react-router');
const Path = require('path');

const Link = React.createClass({
  render() {
    return (
      <a href={this.props.href} onClick={pushState(this.props.href)}>
        {this.props.children}
      </a>
    );
  }
});
module.exports = Link;

function pushState(path) {
  return function(e) {
    e.preventDefault();
    HistoryLocation.push(Path.join(__dirname, path));
  };
}
