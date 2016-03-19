
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
        start={{x: 512, y: 128}}
        bounds="parent"
        onStop={this.onDragStop}
      >
        <div className="palette">
          <div className="palette__header">
            <span className="flex-spacer"></span>
            <button className="btn"><i className="fa fa-cog"></i></button>
          </div>
          <div className="palette__body">
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            blass
            <br />
            
          </div>
          <div className="palette__footer">
            <button className="btn"><i className="fa fa-cog"></i></button>
            <span className="flex-spacer"></span>
            <button className="btn"><i className="fa fa-cog"></i></button>
          </div>
        </div>
      </Draggable>
    );
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

module.exports = Palette;

