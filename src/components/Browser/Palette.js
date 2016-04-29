const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const Draggable = require('react-draggable');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Step = require('./Step');
const {Modes} = require('../../const/browser');
const {dispatch, dispatchBrowserStateChange} = require('../../action');
const Executor = require('../../core/executor');
const {RaisedButton, IconButton} = require('material-ui');

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
              ? <IconButton className="step-adder__verify"
                    iconClassName="fa fa-location-arrow fa-flip-horizontal"
                    tooltip="Verify element"
                    onClick={onAddVerifyingStepClick}
                ></IconButton>
              : null}
            <IconButton className="palette__playback-btn"
                tooltip="Playback testCase"
                iconClassName="fa fa-fw fa-play"
                onClick={onPlaybackClick.bind(this)}
            ></IconButton>
            <span className="flex-spacer"></span>
            <IconButton
                tooltip="Save testCase"
                iconClassName="fa fa-fw fa-save"
                onClick={onClickSaveTestCase.bind(this)}
            ></IconButton>
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
  dispatch('save-testcase', {
    id: this.props.testCaseId,
    steps: this.props.testCase
  });
}

function onAddVerifyingStepClick() {
  dispatch('click-selecting-verify-step');
}

function onPlaybackClick(e) {
  dispatchBrowserStateChange({ mode: Modes.PLAYBACKING });
  Executor.execute(this.props.testCase);
}

module.exports = Palette;

function scrollToBottom() {
  this.refs.palette__body.scrollTop = this.refs.palette__body.scrollHeight - this.refs.palette__body.offsetHeight;
}

function onStepRemoveClicked(step) {
  dispatch('remove-step', { step });
}
