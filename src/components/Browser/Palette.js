const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Draggable = require('react-draggable');

const ReactDOM = require('react-dom');

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="step">
        {this.props.type.name}
      </div>
    );
  }
};

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
        ref="draggable"
      >
        <div className="palette" ref="elm">
          <div className="palette__header">
            <button className="btn btn-lg" onClick={this.props.onPlaybackClick}><i className="fa fa-fw fa-play"></i></button>
            <span className="flex-spacer"></span>
            <button className="btn btn-lg"><i className="fa fa-fw fa-cog"></i></button>
          </div>
          <div className="palette__body">
            {this.props.testCase.map(step => {
              return <Step key={step.id} {...step} />
            })}
          </div>
          <div className="palette__footer">
            <button className="btn btn-lg"><i className="fa fa-fw fa-cog"></i></button>
            <span className="flex-spacer"></span>
            <button className="btn btn-lg"><i className="fa fa-fw fa-cog"></i></button>
          </div>
        </div>
      </Draggable>
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.testCase.length < this.props.testCase.length) {
      // TODO: How I can force update draggable positioning
    }
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

module.exports = Palette;

