
const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const Draggable = require('react-draggable');

class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Draggable
        handle=".handle"
        start={{x: 512, y: 256}}
        bounds="parent"
        onStop={this.onDragStop}
      >
        <div className="palette">
          yeah <span className="handle">handle</span>
        </div>
      </Draggable>
    );
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

module.exports = Palette;

