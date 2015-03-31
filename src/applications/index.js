
var _mixins = require('./_mixins');
var React = require('react');
var Actions = require('../actions');
var Nav = require('../components/Nav');
var Editor = require('../components/Editor');
var IFrame = require('../components/IFrame');
var Scenario = require('../components/Scenario');
var Mask = require('../components/Mask');
var Pixel = require('../components/Pixel');

var Store = require('../stores');

var Index = React.createClass({
  mixins: [_mixins],

  createState() {
    var store = Store.get();
    return {
      url: store.url || 'http://www.yahoo.co.jp',
      isSelectingElement: store.isSelectingElement,
      targetElementBounds: store.targetElementBounds,
      selectedIframeElementData: store.selectedIframeElementData
    };
  },

  render() {
    return (
      <div className="app-index">
        <Nav />
        <Editor {...this.state.selectedIframeElementData} />
        <div className="bottom-content">
          <IFrame url={this.state.url}
                  cssModifier={this.state.isSelectingElement ? 'isSelectingElement' : null}
                  isSelectingElement={this.state.isSelectingElement}
          ></IFrame>
          <Scenario></Scenario>
        </div>
        {this.state.isSelectingElement ? <Mask onCancel={this.onMaskCancelled} /> : null}
        {this.state.targetElementBounds ? <Pixel {...this.state.targetElementBounds} /> : null}
      </div>
    );
  },

  onTitleChange(e) {
    console.log(e)
  },

  onMaskCancelled(e) {
    e.preventDefault();
    Actions.selectElement(false);
  }

});

module.exports = Index;
