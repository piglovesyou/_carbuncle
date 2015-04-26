var React = require('react');
var Nav = require('../components/Nav');
var {State} = require('react-router');
var ScenarioList = require('../stores/ScenarioList');
var ScenarioListComponent = require('../components/ScenarioList');
var {PER_PAGE} = require('../constants');



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
                urlBase="scenario-list"
                 />

          </div>
        </div>
      </div>
    );
  }

});

module.exports = ScenarioListApp;
