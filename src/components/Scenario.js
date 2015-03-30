
var React = require('react');
var {HistoryLocation} = require('react-router');
var Path = require('path');

var Item = React.createClass({
  render() {
    return (
      <div className="scenario__item">
      </div>
    );
  }
});

var Scenario = React.createClass({
  render() {
    return (
      <div className="scenario">
        <div className="scenario__header">header</div>
        <div className="scenario__body">body</div>
        <div className="scenario__footer">footer</div>
      </div>
    );
  }
});
module.exports = Scenario;

function pushState(path) {
  return function(e) {
    e.preventDefault();
    HistoryLocation.push(Path.join(__dirname, path));
  };
}
