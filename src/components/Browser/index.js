import React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import assert from 'power-assert';
import {Container} from 'flux/utils';

import Browser from './Browser';
import Palette from './Palette';
import Recorder from '../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BrowserEmitter from '../../emitter/browser';
import {Modes} from '../../const/browser';
import Store from '../../stores/browser';
import {dispatch, dispatchBrowserStateChange, loadLastTestCase} from '../../action';
import SuperVerifyExplorer from '../../core/verify-explorer';
import IconButton from 'material-ui/IconButton';

import Script from '../../modified-selenium-builder/seleniumbuilder/content/html/builder/script';
import Selenium2 from '../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2';

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
    loadLastTestCase();
  }
  render() {
    // TODO: not mode, use flags
    // no need NEUTRAL
    const isNeutral = this.state.mode === Modes.NEUTRAL;
    const isRecording = this.state.mode === Modes.RECORDING;
    const isPlaybacking = this.state.mode === Modes.PLAYBACKING;
    const isSelecting = this.state.mode === Modes.SELECTING;

    return (
      <div className={`browser-wrapper browser-wrapper--${this.state.mode}`}>
        <Browser
          ref="browser"
          location={this.state.location}
          disablePageMove={!isNeutral}
          enableRecBtn={isNeutral || isRecording}
          onIFrameLoaded=       {isPlaybacking ? null : onIFrameLoaded.bind(this)}
          onLocationTextSubmit= {isPlaybacking ? null : onLocationTextSubmit.bind(this)}
          onHistoryBackClick=   {isPlaybacking ? null : onHistoryBackClick.bind(this)}
          onLocationReloadClick={isPlaybacking ? null : onLocationReloadClick.bind(this)}
          spotRect={this.state.spotRect}
        />
        <Palette
            testCase={this.state.testCase}
            testCaseId={this.state.testCaseId}
            testCaseTitle={this.state.testCaseTitle}
            isRecording={isRecording}
            isSelecting={isSelecting}
        />
      </div>
    );
  }
  componentWillUpdate(nextProps, nextState) {
    this.finalizeHelpers(nextState);
  }
  finalizeHelpers(state) {
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
    this.finalizeHelpers(this.state);
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
  const verifyExplorer = new SuperVerifyExplorer(this, pushStep.bind(this));
  verifyExplorer.on('choose', _ => {
    verifyExplorer.destroy();
    this.verifyExplorer_ = null;
    // Recorder somehow captures my mouseup and I don't want it
    setTimeout(() => {
      dispatchBrowserStateChange({ mode: Modes.RECORDING });
    }, 0);
  });
  return verifyExplorer;
}

import {timeout, showDevTools, closeDevTools} from '../..//util';
function onLocationTextSubmit(e) {
  dispatchBrowserStateChange({
    // TODO: Do this in other way
    location: this.refs.browser.locationInputEl.value +
      (this.refs.browser.locationInputEl.value.endsWith(' ') ? '' : ' ')
  });
  e.preventDefault();
}

function pushStep(step) {
  dispatch('append-step', { step });
}

function getLastStep() {
  return this.state.testCase[this.state.testCase.length - 1];
}

function onIFrameLoaded(e) {
  dispatch('browser-iframe-loaded')
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

// module.exports = Index;
module.exports = Container.create(Index);
