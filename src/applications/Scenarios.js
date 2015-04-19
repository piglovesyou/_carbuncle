var _ = require('underscore');
var React = require('react');
var Nav = require('../components/Nav');
var {State} = require('react-router');
var Table = require('../components/Table');
var Actions = require('../actions');
var ScenariosStore = require('../stores/ScenariosStore');
var componentHelper = require('../components/helper');

var Scenarios = React.createClass({

  getInitialState() {
    return this.createState();
  },

  // componentWillMount() {
  // },

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
    this.setState(this.createState());
  },

  createState() {
    var page = +this.getQuery().page || 0;
    return _.extend({page}, ScenariosStore.get());
  },

  render() {
    var columns = [
      {id: 'title', label: 'title', formatter: row => row.title },
      {id: 'entries', label: 'entries', formatter: row => {
        if (!row.entries) return null;
        return row.entries.map(entry => {
          var tooltip = entry.title + (entry.title && entry.css ? '\n\n' : '') + entry.css;
          return (
            <div className="paged-table--scenarios__entry" title={tooltip}>
              {componentHelper.renderIcon(entry.mode, entry.type)}
            </div>
          );
        });
      }},
      {id: 'buttons', label: '', formatter: row => {
        return [
          <button className="btn btn-xs btn-danger" onClick={Actions.deleteScenario.bind(null, row)}>delete</button>
        ];
      }}
    ];
    return (
      <div className="app-root app-root--scenarios">
        <Nav />
        <div className="layout-scrolable">
          <div className="container" style={{width: 800}}>
            <h2 className="app-root__pagetitle">Scenarios</h2>
            <Table cssModifier="scenarios"
                   currPage={this.state.page || 0}
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
