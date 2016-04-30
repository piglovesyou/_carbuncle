const _ = require('underscore');
import React from 'react';
import Actions from '../actions';
import Nav from '../components/Nav';
import Editor from '../components/Editor';
import IFrame from '../components/IFrame';
import Scenario from '../components/Scenario';
import Mask from '../components/Mask';
import Pixel from '../components/Pixel';
import SelectBlockModal from '../components/SelectBlockModal';

import Store from '../stores';
import EditorState from '../stores/EditorState';
import IFrameState from '../stores/IFrameState';
import ScenarioState from '../stores/ScenarioState';

const Index = React.createClass({

  componentDidMount() {
    Store.addChangeListener(this.onAppStateChange);
    EditorState.addChangeListener(this.onEditorStateChange);
    IFrameState.addChangeListener(this.onIFrameStateChange);
    ScenarioState.addChangeListener(this.onScenarioStateChange);
  },

  componentWillUnmount() {
    Store.removeChangeListener(this.onAppStateChange);
    EditorState.removeChangeListener(this.onEditorStateChange);
    IFrameState.removeChangeListener(this.onIFrameStateChange);
    ScenarioState.removeChangeListener(this.onScenarioStateChange);
  },

  getInitialState() {
    const store = Store.get();
    return {
      isSelectingElement: store.isSelectingElement,
      targetElementBounds: store.targetElementBounds,
      editorState: EditorState.get(),
      iframeState: IFrameState.get(),
      scenarioState: ScenarioState.get()
    };
  },

  onAppStateChange(primal) {
    const store = Store.get();
    this.setState(_.extend({
      isSelectingElement: store.isSelectingElement,
      isSelectingBlock: store.isSelectingBlock,
      targetElementBounds: store.targetElementBounds,
      editorState: EditorState.get(),
      iframeState: IFrameState.get()
    }, primal || {}));
  },

  onEditorStateChange(primal) {
    if (primal && primal.editorState && primal.editorState.css) {
      // Ideally this should be resolved in store phase
      return this.setState({
        targetElementBounds: this.refs.iframe.getBoundsOfCss(primal.editorState.css)
      });
    }
    this.setState({
      editorState: EditorState.get()
    });
  },

  onIFrameStateChange() {
    this.setState({
      iframeState: IFrameState.get()
    });
  },

  onScenarioStateChange() {
    this.setState({
      scenarioState: ScenarioState.get()
    });
  },

  render() {
    return (
      <div className='app-root app-root--index'>
        <Nav />
        <Editor {...this.state.editorState} />
        <div className='bottom-content'>
          <IFrame ref='iframe'
                  {...this.state.iframeState}
                  isSelectingElement={this.state.isSelectingElement}
          ></IFrame>
          <Scenario ref='scenario'
                    {...this.state.scenarioState}></Scenario>
        </div>
        {this.state.isSelectingElement ? <Mask onCancel={this.onMaskCancelled} /> : null}
        {this.state.targetElementBounds ? <Pixel {...this.state.targetElementBounds} /> : null}

        <SelectBlockModal shown={this.state.isSelectingBlock} />

      </div>
    );
  },

  onMaskCancelled(e) {
    e.preventDefault();
    Actions.enableSelectElement(false);
  }

});

module.exports = Index;
