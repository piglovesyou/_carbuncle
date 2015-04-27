var React = require('react');
var Nav = require('../components/Nav');
var ScenarioListComponent = require('../components/ScenarioList');



var ScenarioListApp = React.createClass({

  render() {
    return (
      <div className="app-root app-root--scenario-list">
        <Nav />
        <div className="layout-scrolable">
          <div className="container">
            <h2 className="app-root__pagetitle">シナリオ一覧</h2>

            <ScenarioListComponent cssModifier="scenario-list" />

          </div>
        </div>
      </div>
    );
  }

});

module.exports = ScenarioListApp;
