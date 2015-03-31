
var React = require('react');
// var {HistoryLocation} = require('react-router');
// var Path = require('path');
var Actions = require('../actions');

var IFrame = React.createClass({

  componentDidMount() {
    this.updateEventHandlerIfNeeded();
  },
  componentDidUpdate() {
    this.updateEventHandlerIfNeeded();
  },

  updateEventHandlerIfNeeded() {
    var d = goog.dom.getFrameContentDocument(this.refs.iframe.getDOMNode());
    if (this.props.isSelectingElement) {
      d.addEventListener('click', this.onIframeClick);
      d.addEventListener('mousemove', this.onIframeMove);
    } else {
      d.removeEventListener('click', this.onIframeClick);
      d.removeEventListener('mousemove', this.onIframeMove);
    }
  },

  render() {
    return (
      <div className={'iframe ' + (this.props.cssModifier ? 'iframe--' + this.props.cssModifier : '')}>
        <form className="iframe__form" onSubmit={this.onSubmit} action="">
          <input type="text" ref="url" placeholder="URLを入力"/>
          <button className="btn">Go</button>
        </form>
        <iframe ref="iframe"
                className="iframe__iframe"
                src={this.props.url}
        ></iframe>
      </div>
    );
  },

  onIframeClick(e) {
    console.log(e);
  },

  onIframeMove(e) {
    console.log(e);
  },

  onSubmit(e) {
    e.preventDefault();
    Actions.locationSubmit(
        this.refs.url.getDOMNode().value);
  }

});
module.exports = IFrame;
