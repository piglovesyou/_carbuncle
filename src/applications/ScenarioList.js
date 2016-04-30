import React from 'react';
import Nav from '../components/Nav';
import ScenarioListComponent from '../components/ScenarioList';
import Actions from '../actions';
import ScenarioList from '../stores/ScenarioList';


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
