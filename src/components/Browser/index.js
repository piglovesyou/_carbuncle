const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const assert = require('power-assert');

const Browser = require('./Browser');
const Palette = require('./Palette');
const Recorder = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Executor = require('../../core/executor');
const BrowserEmitter = require('../../emitter/browser');

const Script = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/script');
const Selenium2 = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2');

global.carbuncleTargetFrame = null;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recorder: null,
      isPlaybacking: false,
      testCase: [],
      location: null
    };
    this.recorder_;
    this.goBack = this.goBack.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  render() {
    const isRecording = !!this.state.recorder;
    return (
      <div className="screens-index">
        <Browser
          ref="browser"
          location={this.state.location}
          isRecording={isRecording}
          onRecordButtonClick=  {this.state.isPlaybacking ? null : onRecordButtonClick.bind(this)}
          onIFrameLoaded=       {this.state.isPlaybacking ? null : onIFrameLoaded.bind(this)}
          onLocationTextChange= {this.state.isPlaybacking ? null : onLocationTextChange.bind(this)}
          onLocationTextSubmit= {this.state.isPlaybacking ? null : onLocationTextSubmit.bind(this)}
          onHistoryBackClick=   {this.state.isPlaybacking ? null : onHistoryBackClick.bind(this)}
          onLocationReloadClick={this.state.isPlaybacking ? null : onLocationReloadClick.bind(this)}
        />
        <Palette testCase={this.state.testCase}
            onPlaybackClick={onPlaybackClick.bind(this)} />
      </div>
    );
  }
  componentDidMount() {
    global.carbuncleTargetFrame = this.refs.browser.iFrameEl;
    BrowserEmitter.on('goBack', this.goBack);
    BrowserEmitter.on('refresh', this.refresh);
  }
  componentWillUnmount() {
    global.carbuncleTargetFrame = null;
    if (this.recorder_) {
      this.recorder_.destroy();
      this.recorder_ = null;
    }
    BrowserEmitter.removeListener('goBack', this.goBack);
    BrowserEmitter.removeListener('refresh', this.refresh);
  }
  get iFrameWindow() {
    return this.refs.browser.iFrameEl.contentWindow;
  }
  goBack() {
    this.iFrameWindow.history.back();
  }
  refresh() {
    this.iFrameWindow.location.reload();
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
  if (this.state.recorder) {
    this.state.recorder.destroy();
  }
  Executor.execute(this.state.testCase);
  this.setState({
    isPlaybacking: true,
    recorder: null
  });
}

function onRecordButtonClick(e) {
  const isRecording = !!this.state.recorder;
  if (isRecording) {
    this.state.recorder.destroy();
    this.setState({ recorder: null });
  } else {
    this.setState({
      recorder: createRecorder.call(this)
    });
  }
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
  if (!this.state.recorder) {
    return;
  }
  this.state.recorder.destroy();
  this.state.recorder = createRecorder.call(this);
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

function onHistoryBackClick() {
  this.refs.browser.iFrameEl.contentWindow.history.back();
  if (this.state.recorder) {
    pushStep.call(this, new Script.Step(Selenium2.stepTypes.goBack));
  }
}

function onLocationReloadClick() {
  this.refs.browser.iFrameEl.contentWindow.location.reload();
  if (this.state.recorder) {
    pushStep.call(this, new Script.Step(Selenium2.stepTypes.refresh));
  }
}

module.exports = Index;
