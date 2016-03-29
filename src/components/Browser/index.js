const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const assert = require('power-assert');
const {EventEmitter} = require('events');

const Browser = require('./Browser');
const Palette = require('./Palette');
const Recorder = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Executor = require('../../core/executor');
const BrowserEmitter = require('../../emitter/browser');
const PaletteEmitter = require('../../emitter/palette');

const Script = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/script');
const Selenium2 = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2');
const Locator = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');
const VerifyExplorer = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/verifyexplorer');

const mix = require('../../util/mix');

global.carbuncleTargetFrame = null;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Recording/playbacking/selecting state is messy. Organize them nicely.
      recorder: null,
      isPlaybacking: false,
      testCase: [],
      location: null
    };
    this.goBack = this.goBack.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onStepExecuted = this.onStepExecuted.bind(this);
    this.onTestcaseExecuted = this.onTestcaseExecuted.bind(this);
  }
  render() {
    const isRecording = !!this.state.recorder;
    return (
      <div className="screens-index">
        <Browser
          ref="browser"
          location={this.state.location}
          disablePageMove={isRecording}
          onRecordButtonClick=  {this.state.isPlaybacking ? null : onRecordButtonClick.bind(this)}
          onIFrameLoaded=       {this.state.isPlaybacking ? null : onIFrameLoaded.bind(this)}
          onLocationTextChange= {this.state.isPlaybacking ? null : onLocationTextChange.bind(this)}
          onLocationTextSubmit= {this.state.isPlaybacking ? null : onLocationTextSubmit.bind(this)}
          onHistoryBackClick=   {this.state.isPlaybacking ? null : onHistoryBackClick.bind(this)}
          onLocationReloadClick={this.state.isPlaybacking ? null : onLocationReloadClick.bind(this)}
          spotRect={this.state.spotRect}
        />
        <Palette testCase={this.state.testCase}
            onPlaybackClick={onPlaybackClick.bind(this)}
            onAddVerifyingStepClick={onAddVerifyingStepClick.bind(this)}
        />
      </div>
    );
  }
  componentDidMount() {
    global.carbuncleTargetFrame = this.refs.browser.iFrameEl;
    BrowserEmitter.on('goBack', this.goBack);
    BrowserEmitter.on('refresh', this.refresh);
    PaletteEmitter.on('step-executed', this.onStepExecuted);
    PaletteEmitter.on('testcase-executed', this.onTestcaseExecuted);
  }
  componentWillUnmount() {
    global.carbuncleTargetFrame = null;
    if (this.recorder_) {
      this.recorder_.destroy();
      this.recorder_ = null;
    }
    BrowserEmitter.removeListener('goBack', this.goBack);
    BrowserEmitter.removeListener('refresh', this.refresh);
    PaletteEmitter.removeListener('step-executed', this.onStepExecuted);
    PaletteEmitter.removeListener('testcase-executed', this.onTestcaseExecuted);
  }
  onStepExecuted(step, isSucceeded) {
    step.isSuccessfullyExecuted = isSucceeded;
    this.setState({
      testCase: this.state.testCase.slice(),
      isPlaybacking: true
    });
  }
  onTestcaseExecuted() {
    setTimeout(() => {
      this.state.testCase.forEach(step => step.isSuccessfullyExecuted = null);
      this.setState({
        testCase: this.state.testCase.slice(),
        isPlaybacking: false
      });
    }, 2400);
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

const {timeout, showDevTools, closeDevTools} = require('../..//util');
function onLocationTextSubmit(e) {
  // (async () => {
  //   await showDevTools();
  //   await timeout(800);
  //   debugger;
  // })();
  this.setState({
    location: this.refs.browser.locationInputEl.value +
      (this.refs.browser.locationInputEl.value.endsWith(' ') ? '' : ' ')
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
    this.setState({
      recorder: null,
      isPlaybacking: false
    });
  } else {
    this.setState({
      recorder: createRecorder.call(this),
      isPlaybacking: false
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
  setTimeout(() => {
    this.state.recorder.destroy();
    this.state.recorder = createRecorder.call(this);
  }, 0); // We need this
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

function onAddVerifyingStepClick() {
  if (this.verifyExplorer_) {
    this.verifyExplorer_.destroy();
    this.verifyExplorer_ = null;
    return;
  }
  this.verifyExplorer_ = new SuperVerifyExplorer(this);
  if (this.state.recorder) {
    // destroy but let it keep recording
    this.state.recorder.destroy();
  }
  this.verifyExplorer_.on('choose', _ => {
    this.verifyExplorer_.destroy();
    this.verifyExplorer_ = null;
    // Recorder somehow captures my mouseup and I don't want it
    setTimeout(() => {
      this.setState({
        recorder: createRecorder.call(this),
        isPlaybacking: false
      });
    }, 0);
  });
}

class SuperVerifyExplorer extends mix(VerifyExplorer, EventEmitter) {
  constructor(component, justReturnLocator) {
    super();
    VerifyExplorer.call(this, component.iFrameWindow, Selenium2, pushStep.bind(component), justReturnLocator);
    this.component = component;

    component.setState({spotRect: {enable: true}});
    component.iFrameWindow.document.addEventListener('scroll', this.onDocumentScroll = this.onDocumentScroll.bind(this));
    this.styleEl_ = goog.style.installStyles('*{cursor:pointer!important}', component.iFrameWindow.document);
  }
  /** @override */
  handleMouseup(e) {
    super.handleMouseup(e);
    this.component.setState({ spotRect: null });
    this.emit('choose', this.lastLocator_);
  }
  /** @override */
  handleMouseover(e) {
    const locator = this.lastLocator_ = Locator.fromElement(e.target, true);
    const pos = goog.style.getFramedPageOffset(locator.getPreferredElement(), this.component.iFrameWindow);
    const size = goog.style.getBorderBoxSize(locator.getPreferredElement());
    const rect = this.lastRect_ = Object.assign(pos, size);
    const spotRect = Object.assign({enable: true}, rect);
    this.applyScrollPos(spotRect);
    this.component.setState({spotRect});
  }
  /** @override */
  resetBorder() {}
  /** @override */
  destroy() {
    super.destroy();

    this.component.setState({spotRect: null});
    this.component.iFrameWindow.document.removeEventListener('scroll', this.onDocumentScroll);
    goog.style.installStyles(this.styleEl_);
  }
  onDocumentScroll(e) {
    if (!this.lastRect_) return;
    const spotRect = Object.assign({enable: true}, this.lastRect_);
    this.applyScrollPos(spotRect);
    this.component.setState({spotRect});
  }
  applyScrollPos(pos) {
    pos.x -= this.component.iFrameWindow.document.body.scrollLeft;
    pos.y -= this.component.iFrameWindow.document.body.scrollTop;
  }
}

module.exports = Index;
