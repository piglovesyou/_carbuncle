
var React = require('react');
// var {HistoryLocation} = require('react-router');
// var Path = require('path');
var Actions = require('../actions');
var _ = require('underscore');

var IFrame = React.createClass({

  componentDidMount() {
    this.updateEventHandlerIfNeeded();
  },
  componentDidUpdate() {
    this.updateEventHandlerIfNeeded();
  },

  updateEventHandlerIfNeeded() {
    var d = this.getDocument();
    if (this.props.isSelectingElement) {
      d.addEventListener('click', this.onIframeClick, true);
      d.addEventListener('mousemove', this.onIframeMove, true);
    } else {
      d.removeEventListener('click', this.onIframeClick, true);
      d.removeEventListener('mousemove', this.onIframeMove, true);
    }
  },

  render() {
    return (
      <div className={'iframe ' + (this.props.cssModifier ? 'iframe--' + this.props.cssModifier : '')}>
        <form className="iframe__form" onSubmit={this.onSubmit} action="">
          <input type="text" ref="url" placeholder="URLを入力" defaultValue={this.props.url} />
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
    e.stopPropagation();
    e.preventDefault();
    Actions.selectIFrameElement({
      element: e.target,
      selectorText: this.buildSelector(e.target),
      roughTitle: goog.dom.getTextContent(e.target)
    });
  },

  onIframeMove(e) {
    var et = e.target;
    var iframePos = this.getPosition();
    var pos = goog.style.getPageOffset(et);
    Actions.mouseMove(_.extend({
      x: iframePos.x + pos.x,
      y: iframePos.y + pos.y
    }, goog.style.getBorderBoxSize(et)));
  },

  onSubmit(e) {
    e.preventDefault();
    Actions.locationSubmit(
        this.refs.url.getDOMNode().value);
  },

  getPosition() {
    var pos = goog.style.getPageOffset(this.refs.iframe.getDOMNode());
    var offset = goog.style.getViewportPageOffset(this.getDocument());
    pos.x -= offset.x;
    pos.y -= offset.y;
    return pos;
  },

  getDocument() {
    return goog.dom.getFrameContentDocument(this.refs.iframe.getDOMNode());
  },

  buildSelector(targetNode) {
    var rv = [];
    var node = targetNode;
    do {
      var builder = [];

      // First push tagName for readability.
      if (node.tagName !== 'DIV') {
        builder.push(node.tagName.toLowerCase());
      }

      // Try DOM ID
      var id = node.id && '#' + node.id;
      if (id && this.isElementExists(id)) {
        builder.push(id);
        rv.push(builder.join(''));
        break; // Assume the id is always unique in the webpage.
      } else {
        builder.push(node.className ? '.' + node.className.split(' ').join('.') : '');
        var tmpIndex = this.getChildIndex(node);
        if (tmpIndex > 0) {
          builder.push(':nth-child(' + (tmpIndex + 1) + ')');
        }
        rv.push(builder.join(''));
      }
    } while ((node = node.parentNode) && node && node.tagName && node.tagName.toLowerCase() !== 'html');
    rv.reverse();
    if (this.getDocument().querySelector(rv.join(' ')) !== targetNode) {
      return null;
    }
    return rv.join(' ');
  },

  isElementExists(css) {
    try {
      return !!this.getDocument().querySelector(css);
    } catch (e) {}
    return false;
  },

  getChildIndex(node) {
    var children = goog.dom.getChildren(node.parentNode);
    if (node.parentNode && children.length > 1) {
      for (var i = 0, item = children[i]; i < children.length; item = children[++i]) {
        if (node === item) {
          return i;
        }
      }
    }
    return -1;
  }

});
module.exports = IFrame;
