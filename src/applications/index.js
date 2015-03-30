
var _mixins = require('./_mixins');
var React = require('react');
var Actions = require('../actions');
var Link = require('../components/Link');
var Nav = require('../components/Nav');
var Editor = require('../components/Editor');
var IFrame = require('../components/IFrame');
var Scenario = require('../components/Scenario');
var Mask = require('../components/Mask');

var Store = require('../stores');

var Index = React.createClass({
  
  getInitialState() {
    // Application Context
    return {
      isSelectingElement: false
    }
  },

  createState() {
    var store = Store.get();
    return {
      count: store.count
    };
  },

  mixins: [_mixins],

  render() {
    return (
      <div className="app-index">
        <Nav />
        <Editor onStartSelectElement={enableSelectElement.bind(this, true)} />
        <div className="bottom-content">
          <IFrame cssModifier={this.state.isSelectingElement ? 'isSelectingElement' : null}></IFrame>
          <Scenario></Scenario>
        </div>
        {this.state.isSelectingElement ? <Mask onCancel={enableSelectElement.bind(this, false)} /> : null}
      </div>
    );
  }

});

module.exports = Index;

function enableSelectElement(enable) {
  this.setState({
    isSelectingElement: enable
  });
}
