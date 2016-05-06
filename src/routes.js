import React from 'react';
import { Router, Route, IndexRoute, NotFoundRoute, Link, hashHistory } from 'react-router';
import Root from './components/Root';
import Dashboard from './components/Dashboard';
import TestCases from './components/Dashboard/TestCases';
import Setting from './components/Dashboard/Setting';

// For material-ui
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Theme from './style/theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

module.exports = (
  <MuiThemeProvider muiTheme={Theme}>
    <Router history={hashHistory}>
      <Route path='/' component={Root}>
        <Route path='dashboard' component={Dashboard}>
          <IndexRoute component={TestCases}/>
          <Route path='setting' component={Setting} />
        </Route>
      </Route>
    </Router>
  </MuiThemeProvider>
);
