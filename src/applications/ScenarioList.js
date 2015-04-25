var _ = require('underscore');
var React = require('react');
var Nav = require('../components/Nav');
var {State} = require('react-router');
var Table = require('../components/Table');
var Actions = require('../actions');
var ScenarioList = require('../stores/ScenarioList');
var componentHelper = require('../components/helper');
var ScenarioListComponent = require('../components/ScenarioList');
var {PER_PAGE} = require('../constants');



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

  onChange() {
    this.setState(this.createState());
  },

  createState() {
    return ScenarioList.get();
  },

  mixins: [State],

  render() {
    var currentPage = +this.getQuery().page || 0;
    return (
      <div className="app-root app-root--scenario-list">
        <Nav />
        <div className="layout-scrolable">
          <div className="container">
            <h2 className="app-root__pagetitle">シナリオ一覧</h2>

            <ScenarioListComponent cssModifier="scenario-list"
                results={this.state.list.slice(currentPage * PER_PAGE, currentPage * PER_PAGE + PER_PAGE)}
                currentPage={currentPage}
                maxPage={Math.ceil(this.state.total / PER_PAGE)}
                 />

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
