
var React = require('react');
var Actions = require('../actions');
var Nav = require('../components/Nav');
var Editor = require('../components/Editor');
var IFrame = require('../components/IFrame');
var Scenario = require('../components/Scenario');
var Mask = require('../components/Mask');
var Pixel = require('../components/Pixel');

var Store = require('../stores');
var EditorState = require('../stores/EditorState');
var IFrameState = require('../stores/IFrameState');
var ScenarioState = require('../stores/ScenarioState');
var _ = require('underscore');

var Index = React.createClass({

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
    var store = Store.get();
    return {
      isSelectingElement: store.isSelectingElement,
      targetElementBounds: store.targetElementBounds,
      editorState: EditorState.get(),
      iframeState: IFrameState.get(),
      scenarioState: ScenarioState.get()
    };
  },

  onAppStateChange(primal) {
    var store = Store.get();
    this.setState(_.extend({
      isSelectingElement: store.isSelectingElement,
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

  // createState(primal) {
  //   var store = Store.get();
  //   if (primal && primal.editorState && primal.editorState.css) {
  //     // Editor Css is manually changed by a user
  //     return {
  //       targetElementBounds: this.refs.iframe.getBoundsOfCss(primal.editorState.css)
  //     };
  //   }
  //   return _.extend({
  //     isSelectingElement: store.isSelectingElement,
  //     targetElementBounds: store.targetElementBounds,
  //     editorState: EditorState.get(),
  //     iframeState: IFrameState.get()
  //   }, primal || {});
  // },

  render() {
    return (
      <div className="app-index">
        <Nav />
        <Editor {...this.state.editorState} />
        <div className="bottom-content">
          <IFrame ref="iframe"
                  {...this.state.iframeState}
                  isSelectingElement={this.state.isSelectingElement}
          ></IFrame>
          <Scenario ref="scenario"
                    {...this.state.scenarioState}></Scenario>
        </div>
        {this.state.isSelectingElement ? <Mask onCancel={this.onMaskCancelled} /> : null}
        {this.state.targetElementBounds ? <Pixel {...this.state.targetElementBounds} /> : null}
      </div>
    );
  },

  onMaskCancelled(e) {
    e.preventDefault();
    Actions.enableSelectElement(false);
  }

});

module.exports = Index;
