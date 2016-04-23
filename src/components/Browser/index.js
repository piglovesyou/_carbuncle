const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const assert = require('power-assert');
const {EventEmitter} = require('events');
const {Container} = require('flux/utils');

const Browser = require('./Browser');
const Palette = require('./Palette');
const Recorder = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Executor = require('../../core/executor');
const BrowserEmitter = require('../../emitter/browser');
const {Modes} = require('../../const/browser');
const Store = require('../../stores/browser');
const {dispatch} = require('../../dispatcher');

const Script = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/script');
const Selenium2 = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2');
const Locator = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');
const VerifyExplorer = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/verifyexplorer');

const mix = require('../../util/mix');

global.carbuncleTargetFrame = null;

class Index extends React.Component {
  static getStores() {
    return [Store];
  }
  static calculateState(prevState) {
    return Store.getState();
  }
  constructor(props) {
    super(props);
    this.recorder_;
    this.goBack = this.goBack.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.onTestcaseExecuted = this.onTestcaseExecuted.bind(this);
  }
  render() {
    const isNeutral = this.state.mode === Modes.NEUTRAL;
    const isRecording = this.state.mode === Modes.RECORDING;
    const isPlaybacking = this.state.mode === Modes.PLAYBACKING;
    const isSelecting = this.state.mode === Modes.SELECTING;
    return (
      <div className="browser-wrapper">
        <Browser
          ref="browser"
          location={this.state.location}
          disablePageMove={!isNeutral}
          onRecordButtonClick=  {isPlaybacking ? null : onRecordButtonClick.bind(this)}
          onIFrameLoaded=       {isPlaybacking ? null : onIFrameLoaded.bind(this)}
          onLocationTextChange= {isPlaybacking ? null : onLocationTextChange.bind(this)}
          onLocationTextSubmit= {isPlaybacking ? null : onLocationTextSubmit.bind(this)}
          onHistoryBackClick=   {isPlaybacking ? null : onHistoryBackClick.bind(this)}
          onLocationReloadClick={isPlaybacking ? null : onLocationReloadClick.bind(this)}
          spotRect={this.state.spotRect}
        />
        <Palette testCase={this.state.testCase}
            isRecording={isRecording}
            onPlaybackClick={onPlaybackClick.bind(this)}
            onAddVerifyingStepClick={isRecording || isSelecting ? onAddVerifyingStepClick.bind(this) : null}
        />
      </div>
    );
  }
  componentWillUpdate(nextProps, nextState) {
    this.finalizeCurrentMode(nextState);
  }
  finalizeCurrentMode(state) {
    if (this.state.mode !== state.mode) {
      this.previousMode_ = this.state.mode;
    }
    switch(state.mode) {
      case Modes.RECORDING:
        if (!this.recorder_) {
          this.recorder_ = createRecorder.call(this);
        }
        break;
      default:
        if (this.recorder_) {
          this.recorder_.destroy();
          this.recorder_ = null;
        }
        break;
    }
    switch(state.mode) {
      case Modes.SELECTING:
        if (!this.verifyExplorer_) {
          this.verifyExplorer_ = createVerifyExplorer.call(this);
        }
        break;
      default:
        if (this.verifyExplorer_) {
          this.verifyExplorer_.destroy();
          this.verifyExplorer_ = null;
        }
        break;
    }
  }
  componentDidMount() {
    global.carbuncleTargetFrame = this.refs.browser.iFrameEl;
    BrowserEmitter.on('goBack', this.goBack);
    BrowserEmitter.on('refresh', this.refresh);
    // BrowserEmitter.on('testcase-executed', this.onTestcaseExecuted);
    this.finalizeCurrentMode(this.state);
  }
  componentWillUnmount() {
    global.carbuncleTargetFrame = null;
    if (this.recorder_) {
      this.recorder_.destroy();
      this.recorder_ = null;
    }
    BrowserEmitter.removeListener('goBack', this.goBack);
    BrowserEmitter.removeListener('refresh', this.refresh);
    // BrowserEmitter.removeListener('testcase-executed', this.onTestcaseExecuted);
  }
  // onTestcaseExecuted() {
  //   setTimeout(() => {
  //     dispatch({
  //       type: 'change', data: {
  //         testCase: this.state.testCase.map(step => {
  //           step.isSuccessfullyExecuted_ = null;
  //           return step;
  //         })
  //       }
  //     });
  //   }, 2400);
  //   dispatch({
  //     type: 'change', data: { mode: this.previousMode_ }
  //   });
  // }
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

function createVerifyExplorer() {
  const verifyExplorer = new SuperVerifyExplorer(this);
  verifyExplorer.on('choose', _ => {
    verifyExplorer.destroy();
    this.verifyExplorer_ = null;
    // Recorder somehow captures my mouseup and I don't want it
    setTimeout(() => {
      dispatch({type: 'change', data: {mode: Modes.RECORDING} });
      // this.setState({ mode: Modes.RECORDING });
    }, 0);
  });
  return verifyExplorer;
}

function onLocationTextChange(e) {
  console.log(e.type);
}

const {timeout, showDevTools, closeDevTools} = require('../..//util');
function onLocationTextSubmit(e) {
  dispatch({type: 'change', data: {
    // TODO: Do this in other way
    location: this.refs.browser.locationInputEl.value +
      (this.refs.browser.locationInputEl.value.endsWith(' ') ? '' : ' ')
  } });
  // this.setState({
  //   // TODO: Do this in other way
  //   location: this.refs.browser.locationInputEl.value +
  //     (this.refs.browser.locationInputEl.value.endsWith(' ') ? '' : ' ')
  // });
  e.preventDefault();
}

function onPlaybackClick(e) {
  dispatch({type: 'change', data: {mode: Modes.PLAYBACKING} });
  // this.setState({ mode: Modes.PLAYBACKING });
  Executor.execute(this.state.testCase);
}

function onRecordButtonClick(e) {
  dispatch({ type: 'click-recording' });
  // if (this.state.mode === Modes.NEUTRAL) {
  //   dispatch({type: 'change', data: {mode: Modes.RECORDING} });
  //   // this.setState({ mode: Modes.RECORDING });
  // } else if (this.state.mode === Modes.RECORDING) {
  //   dispatch({type: 'change', data: {mode: Modes.NEUTRAL} });
  //   // this.setState({ mode: Modes.NEUTRAL });
  // }  else {
  //   assert.fail('dont let record btn be clicked besides NEUTRAL or RECORDING mode');
  // }
}

function pushStep(step) {
  dispatch({ type: 'append-step', step });
}

function getLastStep() {
  return this.state.testCase[this.state.testCase.length - 1];
}

function onIFrameLoaded(e) {
  dispatch({ type: 'browser-iframe-loaded' })
  if (this.state.mode !== Modes.RECORDING) return;

  // Attach events on new frame
  setTimeout(() => {
    if (this.state.mode !== Modes.RECORDING) return;
    this.recorder_.destroy();
    this.recorder_ = createRecorder.call(this);
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
  if (this.state.mode === Modes.RECORDING) {
    pushStep.call(this, new Script.Step(Selenium2.stepTypes.goBack));
  }
}

function onLocationReloadClick() {
  this.refs.browser.iFrameEl.contentWindow.location.reload();
  if (this.state.mode === Modes.RECORDING) {
    pushStep.call(this, new Script.Step(Selenium2.stepTypes.refresh));
  }
}

function onAddVerifyingStepClick() {
  dispatch({type: 'click-selecting-verify-step'});
}

class SuperVerifyExplorer extends mix(VerifyExplorer, EventEmitter) {
  constructor(component, justReturnLocator) {
    super();
    VerifyExplorer.call(this, component.iFrameWindow, Selenium2, pushStep.bind(component), justReturnLocator);
    this.component = component;

    dispatch({type: 'change', data: {spotRect: {enable: true} } });
    // component.setState({spotRect: {enable: true}});
    component.iFrameWindow.document.addEventListener('scroll', this.onDocumentScroll = this.onDocumentScroll.bind(this));
    this.styleEl_ = goog.style.installStyles('*{cursor:pointer!important}', component.iFrameWindow.document);
  }
  /** @override */
  handleMouseup(e) {
    super.handleMouseup(e);
    dispatch({ type: 'change', data: {spotRect: null } });
    // this.component.setState({ spotRect: null });
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
    dispatch({type: 'change', data: {spotRect} });
    // this.component.setState({spotRect});
  }
  /** @override */
  resetBorder() {}
  /** @override */
  destroy() {
    super.destroy();

    dispatch({type: 'change', data: {spotRect: null} });
    // this.component.setState({spotRect: null});
    this.component.iFrameWindow.document.removeEventListener('scroll', this.onDocumentScroll);
    goog.style.installStyles(this.styleEl_);
  }
  onDocumentScroll(e) {
    if (!this.lastRect_) return;
    const spotRect = Object.assign({enable: true}, this.lastRect_);
    this.applyScrollPos(spotRect);
    dispatch({type: 'change', data: {spotRect} });
    // this.component.setState({spotRect});
  }
  applyScrollPos(pos) {
    pos.x -= this.component.iFrameWindow.document.body.scrollLeft;
    pos.y -= this.component.iFrameWindow.document.body.scrollTop;
  }
}

// module.exports = Index;
module.exports = Container.create(Index);
