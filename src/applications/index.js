
var _mixins = require('./_mixins');
var React = require('react');
var Actions = require('../actions');
// var Link = require('../components/Link');
var Nav = require('../components/Nav');
var Editor = require('../components/Editor');
var IFrame = require('../components/IFrame');
var Scenario = require('../components/Scenario');
var Mask = require('../components/Mask');

var Store = require('../stores');

var Index = React.createClass({

  createState() {
    var store = Store.get();
    return {
      url: store.url,
      isSelectingElement: store.isSelectingElement
    };
  },

  mixins: [_mixins],

  render() {
    return (
      <div className="app-index">
        <Nav />
        <Editor />
        <div className="bottom-content">
          <IFrame url={this.state.url}
                  cssModifier={this.state.isSelectingElement ? 'isSelectingElement' : null}
                  isSelectingElement={this.state.isSelectingElement}
          ></IFrame>
          <Scenario></Scenario>
        </div>
        {this.state.isSelectingElement ? <Mask onCancel={this.onMaskCancelled} /> : null}
      </div>
    );
  },

  onMaskCancelled(e) {
    e.preventDefault();
    Actions.selectElement(false);
  }

});

module.exports = Index;
