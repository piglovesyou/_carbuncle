
var React = require('react');
var {HistoryLocation} = require('react-router');
var Path = require('path');

var Link = React.createClass({

  getInitialState() {
    return {
      url: ''
    };
  },

  render() {
    return (
      <div className={'iframe ' + (this.props.cssModifier ? 'iframe--' + this.props.cssModifier : '')}>
        <form className="iframe__form" onSubmit={this.onSubmit} action="">
          <input type="text" ref="url" placeholder="URLを入力"/>
          <button className="btn">Go</button>
        </form>
        <iframe className="iframe__iframe" src={this.state.url}></iframe>
      </div>
    );
  },

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      url: this.refs.url.getDOMNode().value
    });
  }

});
module.exports = Link;

function pushState(path) {
  return function(e) {
    e.preventDefault();
    HistoryLocation.push(Path.join(__dirname, path));
  };
}
