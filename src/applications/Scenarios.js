const _ = require('underscore');
const React = require('react');
const Nav = require('../components/Nav');
const {State} = require('react-router');
const Table = require('../components/Table');
const Actions = require('../actions');
const ScenarioList = require('../stores/ScenarioList');
const componentHelper = require('../components/helper');

const ScenarioListApp = React.createClass({

  getInitialState() {
    return this.createState();
  },

  // componentWillMount() {
  // },

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
    const page = +this.getQuery().page || 0;
    return _.extend({page}, ScenarioList.get());
  },

  render() {
    const columns = [
      {id: 'title', label: 'title', formatter: row => row.title},
      {id: 'entries', label: 'entries', formatter: row => {
        if (!row.entries) return null;
        return row.entries.map(entry => {
          const tooltip = entry.title + (entry.title && entry.css ? '\n\n' : '') + entry.css;
          return (
            <div className='paged-table--scenario-list__entry' title={tooltip}>
              {componentHelper.renderIcon(entry.mode, entry.type)}
            </div>
          );
        });
      }},
      {id: 'buttons', label: '', formatter: row => {
        return [
          <button className='btn btn-xs btn-danger' onClick={Actions.deleteScenario.bind(null, row)}>delete</button>
        ];
      }}
    ];
    return (
      <div className='app-root app-root--scenario-list'>
        <Nav />
        <div className='layout-scrolable'>
          <div className='container' style={{width: 800}}>
            <h2 className='app-root__pagetitle'>ScenarioList</h2>
            <Table cssModifier='scenario-list'
                   currPage={this.state.page || 0}
                   total={this.state.total}
                   columns={columns}
                   rows={this.state.list}
                   urlBase={'/scenario-list'}></Table>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ScenarioListApp;
