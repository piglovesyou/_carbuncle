
var _mixins = require('./_mixins');
var React = require('react');
var Link = require('../components/Link');

var Store = require('../stores');

var Index = React.createClass({

  createState() {
    var store = Store.get();
    return {
      count: store.count
    };
  },

  mixins: [_mixins],

  render() {
    return (
      <div className="app-setting container">
        <h1><i className="fa fa-diamond"></i> Setting.</h1>
        <p><Link href="/index">&lt;- Back</Link></p>
        <p>Clicked {this.state.count} times</p>
      </div>
    );
  }

});

module.exports = Index;
