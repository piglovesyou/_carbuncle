const React = require('react');
const { Router, Route, IndexRoute, NotFoundRoute, Link, hashHistory } = require('react-router');
const Index = require('./screens');
// const Dashboard = require('./screens/Dashboard');
// const Index = require('./applications');
// const ScenarioList = require('./applications/ScenarioList');
// const Setting = require('./applications/Setting');


class Dashboard extends React.Component {
  render() {
    return (
      <div className="screens-dashboard">
        {this.props.children}
      </div>
    );
  }
}

class DashboardIndex extends React.Component {
  render() {
    return (
      <div className="screens-dashboard-index">
        dashboard-index
        <Link to="/">top</Link>
        <Link to="/dashboard">dashboard</Link>
        <Link to="/dashboard/setting">dashboard-setting</Link>
      </div>
    );
  }
}

class Setting extends React.Component {
  render() {
    return (
      <div className="screens-dashboard-setting">
        dashboard-setting
        <Link to="/">top</Link>
        <Link to="/dashboard">dashboard</Link>
        <Link to="/dashboard/setting">dashboard-setting</Link>
      </div>
    );
  }
}

module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={Index} />
    <Route path='/dashboard' component={Dashboard}>
      <IndexRoute component={DashboardIndex}/>
      <Route path='setting' component={Setting} />
    </Route>
    <Route path='*' component={NotFoundRoute} />
  </Router>
);
