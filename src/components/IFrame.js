
const React = require('react');
// const {HistoryLocation} = require('react-router');
// const Path = require('path');
const Actions = require('../actions');
const _ = require('underscore');

const IFrame = React.createClass({

  componentDidMount() {
    this.enableSelectingEvent(this.props.isSelectingElement);
    this.refs.iframe.getDOMNode().addEventListener('load', this.onLoad);
    this.refs.iframe.getDOMNode().setAttribute('nwdisable', 'nwdisable');
    this.refs.iframe.getDOMNode().setAttribute('nwfaketop', 'nwfaketop');
  },

  componentDidUpdate() {
    this.enableSelectingEvent(this.props.isSelectingElement);
  },

  componentDidUnmount() {
    this.enableSelectingEvent(false);
    this.refs.iframe.getDOMNode().removeEventListener('load', this.onLoad);
  },

  enableSelectingEvent(enable) {
    const d = this.getDocument();
    if (enable) {
      d.addEventListener('click', this.onIframeClick, true);
      d.addEventListener('mousemove', this.onIframeMove, true);
    } else {
      d.removeEventListener('click', this.onIframeClick, true);
      d.removeEventListener('mousemove', this.onIframeMove, true);
    }
  },

  render() {
    return (
      <div className={'iframe' + (this.props.isSelectingElement ? ' iframe--isSelectingElement' : '')}>
        <form className='iframe__form' onSubmit={this.onSubmit} action=''>
          <input type='text'
                 ref='url'
                 placeholder='URLを入力'
                 defaultValue={this.props.url}
                 />
          <button className='btn'>Go</button>
        </form>
        <iframe ref='iframe'
                className='iframe__iframe'
                src={this.props.url}
        ></iframe>
      </div>
    );
  },

  onIframeClick(e) {
    e.stopPropagation();
    e.preventDefault();
    Actions.selectIFrameElement({
      title: goog.dom.getTextContent(e.target),
      css: this.buildSelector(e.target),
      elementRef: e.target
    });
  },

  onIframeMove(e) {
    Actions.mouseMove(this.getBoundsOfElement(e.target));
  },

  getBoundsOfElement(element) {
    const iframePos = this.getPosition();
    const pos = goog.style.getPageOffset(element);
    return _.extend({
      x: iframePos.x + pos.x,
      y: iframePos.y + pos.y
    }, goog.style.getBorderBoxSize(element));
  },

  getBoundsOfCss(css) {
    const element = this.querySelectorSafely(css);
    if (element) {
      return this.getBoundsOfElement(element);
    }
    return null;
  },

  onSubmit(e) {
    e.preventDefault();
    this.getDocument().removeEventListener('scroll', this.onScroll);
    Actions.locationChange({
      url: this.refs.url.getDOMNode().value
    });
  },

  onLoad(e) {
    e.preventDefault();
    this.getDocument().addEventListener('scroll', this.onScroll);
    Actions.locationChange({
      url: this.refs.iframe.getDOMNode().contentWindow.location.href,
      title: this.getDocument().title
    });
  },

  onScroll(e) {
    Actions.iframeScroll();
  },

  getPosition() {
    const pos = goog.style.getPageOffset(this.refs.iframe.getDOMNode());
    const offset = goog.style.getViewportPageOffset(this.getDocument());
    pos.x -= offset.x;
    pos.y -= offset.y;
    return pos;
  },

  getDocument() {
    return goog.dom.getFrameContentDocument(this.refs.iframe.getDOMNode());
  },

  buildSelector(targetNode) {
    const rv = [];
    let node = targetNode;
    do {
      const builder = [];

      // First push tagName for readability.
      if (node.tagName !== 'DIV') {
        builder.push(node.tagName.toLowerCase());
      }

      // Try DOM ID
      const id = node.id && '#' + node.id;
      if (id && this.querySelectorSafely(id)) {
        builder.push(id);
        rv.push(builder.join(''));
        break; // Assume the id is always unique in the webpage.
      } else {
        const className = goog.string.collapseWhitespace(node.className);
        if (!goog.string.isEmptyOrWhitespace(className)) {
          builder.push('.' + className.split(' ').join('.'));
        }
        const tmpIndex = this.getChildIndex(node);
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

  querySelectorSafely(css) {
    try {
      return this.getDocument().querySelector(css);
    } catch (e) {}
    return false;
  },

  getChildIndex(node) {
    const children = goog.dom.getChildren(node.parentNode);
    if (node.parentNode && children.length > 1) {
      for (let i = 0, item = children[i]; i < children.length; item = children[++i]) {
        if (node === item) {
          return i;
        }
      }
    }
    return -1;
  }

});
module.exports = IFrame;
