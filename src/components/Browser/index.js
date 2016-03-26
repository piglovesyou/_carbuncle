const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');

const Browser = require('./Browser');
const Palette = require('./Palette');
const Recorder = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Executor = require('../../core/executor');
// const assert = require('power-assert');

global.carbuncleTargetFrame = null;
global.carbuncleTargetWindow = null;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      isPlaybacking: false,
      testCase: [],
      location: null
    };
    this.recorder_;
  }
  render() {
    return (
      <div className="screens-index">
        <Browser
          ref="browser"
          location={this.state.location}
          isRecording={this.state.isRecording}
          onRecordButtonClick= {this.state.isPlaybacking ? null : onRecordButtonClick.bind(this)}
          onIFrameLoaded=      {this.state.isPlaybacking ? null : onIFrameLoaded.bind(this)}
          onLocationTextChange={this.state.isPlaybacking ? null : onLocationTextChange.bind(this)}
          onLocationTextSubmit={this.state.isPlaybacking ? null : onLocationTextSubmit.bind(this)}
        />
        <Palette testCase={this.state.testCase}
            onPlaybackClick={onPlaybackClick.bind(this)} />
      </div>
    );
  }
  componentDidMount() {
    global.carbuncleTargetFrame = this.refs.browser.iFrameEl;
    global.carbuncleTargetWindow = this.refs.browser.iFrameEl.contentWindow;
  }
  get iFrameWindow() {
    return this.refs.browser.iFrameEl.contentWindow;
  }
}

function onLocationTextChange(e) {
  console.log(e.type);
}

function onLocationTextSubmit(e) {
  this.setState({
    location: this.refs.browser.locationInputEl.value
  });
  e.preventDefault();
}

function onPlaybackClick(e) {
  if (this.recorder_) {
    this.recorder_.destroy();
    this.recorder_ = null;
  }
  Executor.execute(this.state.testCase);
  this.setState({
    isPlaybacking: true,
    isRecording: false
  });
}

function onRecordButtonClick(e) {
  const changeTo = !this.state.isRecording;
  if (changeTo) {
    this.recorder_ = createRecorder.call(this);
  }
  this.setState({
    isRecording: changeTo
  });
}

function pushStep(step) {
  console.log(step);

  if (this.state.isPlaybacking) {
    return;
  }

  const testCase = this.state.testCase.slice();

  const lastStep = getLastStep.call(this);
  if (lastStep) { /* TODO: 'sendKeysToElement' can concat */ }

  testCase.push(step);
  this.setState({ testCase });
}

function getLastStep() {
  return this.state.testCase[this.state.testCase.length - 1];
}

function onIFrameLoaded(e) {
  if (!this.state.isRecording || this.state.isPlaybacking) {
    return;
  }
  setTimeout(() => {
    this.recorder_.destroy();
    this.recorder_ = createRecorder.call(this);
  }, 100);
}

function createRecorder() {
  return new Recorder(
      this.refs.browser.iFrameEl,
      pushStep.bind(this),
      getLastStep.bind(this),
      getStepBefore.bind(this));
}

function getStepBefore(step) {
  return this.state.testCase[this.state.testCase.findIndex(s => s.id === step.id) - 1];
}

module.exports = Index;
