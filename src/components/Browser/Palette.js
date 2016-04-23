const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const Draggable = require('react-draggable');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Step = require('./Step');

const ReactDOM = require('react-dom');

class StepAdder extends React.Component {
  render() {
    return (
      <div className="step-adder">
        <button className="step-adder__verify btn btn-default"
            onClick={this.props.onAddVerifyingStepClick}
            title="Add verifying step"
        >
          <i className="fa fa-location-arrow fa-flip-horizontal"></i>
          &nbsp;Verify
        </button>
      </div>
    );
  }
}

class Palette extends React.Component {
  render() {
    return (
      <Draggable
        handle=".palette__handle"
        start={{x: 512, y: 128}}
        bounds="parent"
        ref="draggable"
      >
        <div className="palette" ref="elm">
          <div className="palette__header">
            <button className="btn btn-default btn-lg" onClick={this.props.onPlaybackClick}><i className="fa fa-fw fa-play"></i></button>
            <span className="palette__handle flex-spacer">
            </span>
            <button className="btn btn-default btn-lg"><i className="fa fa-fw fa-cog"></i></button>
          </div>
          <div className="palette__body" ref="palette__body">
            <ReactCSSTransitionGroup
                transitionName="step"
                transitionEnterTimeout={900}
                transitionLeaveTimeout={200}
            >
              {this.props.testCase.map(step => {
                return <Step key={step.id}
                    onStepRemoveClicked={onStepRemoveClicked.bind(this, step)}
                    {...step} />
              })}
            </ReactCSSTransitionGroup>
          </div>
          <div className="palette__footer">
            {this.props.onAddVerifyingStepClick
              ? <button className="step-adder__verify btn btn-default"
                    onClick={this.props.onAddVerifyingStepClick}
                    title="Add verifying step"
                >
                  <i className="fa fa-location-arrow fa-flip-horizontal"></i>
                  &nbsp;Verify
                </button>
              : null}
            <span className="flex-spacer"></span>
          </div>
        </div>
      </Draggable>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.testCase.length > prevProps.testCase.length) {
      scrollToBottom.call(this);
    }
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

module.exports = Palette;

function scrollToBottom() {
  this.refs.palette__body.scrollTop = this.refs.palette__body.scrollHeight - this.refs.palette__body.offsetHeight;
}

function onStepRemoveClicked(step) {
  const index = this.props.testCase.findIndex(s => s.id === step.id);
  if (index < 0) return;
  this.setState({
    testCase: this.props.testCase.splice(index, 1)
  });
}
