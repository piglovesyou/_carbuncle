
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
var _ = require('underscore');

var Index = React.createClass({

  componentDidMount() {
    Store.addChangeListener(this._onChange);
    EditorState.addChangeListener(this._onChange);
    IFrameState.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
    EditorState.removeChangeListener(this._onChange);
    IFrameState.removeChangeListener(this._onChange);
  },

  getInitialState() {
    return this.createState();
  },

  _onChange(primal) {
    this.setState(this.createState(primal));
  },

  createState(primal) {
    var store = Store.get();
    return _.extend({
      isSelectingElement: store.isSelectingElement,
      targetElementBounds: store.targetElementBounds,
      editorState: EditorState.get(),
      iframeState: IFrameState.get()
    }, primal || {});
  },

  render() {
    return (
      <div className="app-index">
        <Nav />
        <Editor {...this.state.editorState} />
        <div className="bottom-content">
          <IFrame {...this.state.iframeState}
                  isSelectingElement={this.state.isSelectingElement}
          ></IFrame>
          <Scenario></Scenario>
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
