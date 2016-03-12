
var React = require('react');
var {HistoryLocation} = require('react-router');
var Path = require('path');

var Link = React.createClass({
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
