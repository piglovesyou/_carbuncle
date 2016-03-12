const React = require('react');
const Nav = require('../components/Nav');
const ScenarioListComponent = require('../components/ScenarioList');
const Actions = require('../actions');
const ScenarioList = require('../stores/ScenarioList');


const ScenarioListApp = React.createClass({

  render() {
    return (
      <div className='app-root app-root--scenario-list'>
        <Nav />
        <div className='layout-scrolable'>
          <div className='container'>
            <h2 className='app-root__pagetitle'>シナリオ一覧</h2>

            <ScenarioListComponent
                store={ScenarioList}
                cssModifier='scenario-list'
                onClickRow={Actions.startEditScenario.bind(this)}/>

          </div>
        </div>
      </div>
    );
  }

});

module.exports = ScenarioListApp;
