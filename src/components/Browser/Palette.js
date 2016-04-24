const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const Draggable = require('react-draggable');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Step = require('./Step');
const {Modes} = require('../../const/browser');
const {dispatch, dispatchChange} = require('../../dispatcher');
const Executor = require('../../core/executor');

const ReactDOM = require('react-dom');

class Palette extends React.Component {
  render() {
    const steps = this.props.testCase.map(step =>
        <Step key={step.id} onStepRemoveClicked={onStepRemoveClicked.bind(null, step)} {...step} />);
    return (
      <Draggable
        handle=".palette__handle"
        start={{x: 512, y: 128}}
        bounds="parent"
        ref="draggable"
      >
        <div className="palette" ref="elm">
          <div className="palette__header">
            <button className="btn btn-default btn-lg palette__playback-btn" onClick={onPlaybackClick.bind(this)}><i className="fa fa-fw fa-play"></i></button>
            <span className="palette__handle flex-spacer">
            </span>
            <button className="btn btn-default btn-lg"
                onClick={onClickSaveTestCase.bind(this)}
            >
              <i className="fa fa-fw fa-save"></i>
            </button>
          </div>
          <div className="palette__body" ref="palette__body">
            {this.props.isRecording || this.props.isSelecting
              ? <ReactCSSTransitionGroup
                 transitionName="step"
                 transitionEnterTimeout={900}
                 transitionLeaveTimeout={200}
                >{steps}</ReactCSSTransitionGroup>
              : steps}
          </div>
          <div className="palette__footer">
            {this.props.isRecording || this.props.isSelecting
              ? <button className="step-adder__verify btn btn-default"
                    onClick={onAddVerifyingStepClick}
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

function onClickSaveTestCase() {
  dispatch({
    type: 'save-testcase',
    id: this.props.testCaseId,
    steps: this.props.testCase
  });
}

function onAddVerifyingStepClick() {
  dispatch({type: 'click-selecting-verify-step'});
}

function onPlaybackClick(e) {
  dispatchChange({ mode: Modes.PLAYBACKING });
  Executor.execute(this.props.testCase);
}

module.exports = Palette;

function scrollToBottom() {
  this.refs.palette__body.scrollTop = this.refs.palette__body.scrollHeight - this.refs.palette__body.offsetHeight;
}

function onStepRemoveClicked(step) {
  dispatch({ type: 'remove-step', step });
}
