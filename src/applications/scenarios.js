var _ = require('underscore');
var React = require('react');
var Nav = require('../components/Nav');
var {State} = require('react-router');
var Table = require('../components/Table');
// var Actions = require('../actions');
var ScenariosStore = require('../stores/ScenariosStore');
var componentHelper = require('../component/helper');

var Scenarios = React.createClass({

  getInitialState() {
    return ScenariosStore.get();
  },

  componentDidMount() {
    ScenariosStore.addChangeListener(this.onChange);
    this.syncPage();
  },

  componentWillUpdate() {
    this.syncPage();
  },

  componentDidUnmount() {
    ScenariosStore.removeChangeListener(this.onChange);
  },

  syncPage() {
    ScenariosStore.sync(+this.getQuery().page || 0);
  },

  mixins: [State],

  onChange() {
    var page = +this.getQuery().page || 0;
    this.setState(
      _.extend({}, ScenariosStore.get(), {page})
    );
  },

  render() {
    var columns = [
      {id: 'title', label: 'title', formatter: row => row.title },
      {id: 'entries', label: 'entries', formatter: row => componentHelper.renderIcon(row.mode, row.type) }
    ];
    return (
      <div className="app-root app-root--scenarios">
        <Nav />
        <div className="layout-scrolable">
          <div className="container" style={{width: 800}}>
            <h2 className="app-root__pagetitle">Scenarios</h2>
            <Table currPage={this.state.page || 0}
                   total={this.state.total}
                   columns={columns}
                   rows={this.state.list}
                   urlBase={'/scenarios'}></Table>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Scenarios;
