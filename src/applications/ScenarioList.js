var _ = require('underscore');
var React = require('react');
var Nav = require('../components/Nav');
var {State} = require('react-router');
var Table = require('../components/Table');
var Actions = require('../actions');
var ScenarioList = require('../stores/ScenarioList');
var componentHelper = require('../components/helper');
var GriddleWrapper = require('../components/GriddleWrapper');



var faked = [
  {id: 0, title: 'yeah'},
  {id: 1, title: 'yeah'},
  {id: 2, title: 'ohh'},
  {id: 3, title: 'yeah'},
];

var ScenarioListApp = React.createClass({

  getInitialState() {
    return this.createState();
  },

  componentDidMount() {
    ScenarioList.addChangeListener(this.onChange);
    this.syncPage();
  },

  componentWillUpdate() {
    this.syncPage();
  },

  componentDidUnmount() {
    ScenarioList.removeChangeListener(this.onChange);
  },

  syncPage() {
    ScenarioList.sync(+this.getQuery().page || 0);
  },

  mixins: [State],

  onChange() {
    this.setState(this.createState());
  },

  createState() {
    var page = +this.getQuery().page || 0;
    return _.extend({page}, ScenarioList.get());
  },

  render() {
    var columns = [
      {id: 'title', label: 'title', formatter: row => row.title},
      {id: 'entries', label: 'entries', formatter: this.renderEntries},
      {id: 'updated-by', label: 'updated by', formatter: row => row.updatedBy},
      {id: 'buttons', label: '', formatter: this.renderButtons}
    ];
    return (
      <div className="app-root app-root--scenario-list">
        <Nav />
        <div className="layout-scrolable">
          <div className="container">
            <h2 className="app-root__pagetitle">シナリオ一覧</h2>

            <GriddleWrapper cssModifier="scenario-list"
                externalCurrentPage={this.state.page} />

            <Table cssModifier="scenario-list"
                   currPage={this.state.page || 0}
                   total={this.state.total}
                   columns={columns}
                   rows={this.state.list}
                   urlBase={'/scenario-list'}></Table>
          </div>
        </div>
      </div>
    );
  },

  renderEntries(row) {
    if (!row.entries) return null;
    return row.entries.map(entry => {
      var tooltip = entry.title + (entry.title && entry.css ? '\n\n' : '') + entry.css;
      return (
        <div className="paged-table--scenario-list__entry" title={tooltip}>
          {componentHelper.renderIcon(entry.mode, entry.type)}
        </div>
      );
    });
  },

  renderButtons(row) {
    return [
      <button className="btn btn-xs btn-success" onClick={this.startToEditScenario.bind(this, row)}>view</button>,
      <button className="btn btn-xs btn-danger" onClick={Actions.deleteScenario.bind(null, row)}>delete</button>
    ];
  },

  startToEditScenario(row) {
    Actions.startEditScenario(row);
  }

});

module.exports = ScenarioListApp;
