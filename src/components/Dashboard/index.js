import React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

class Dashboard extends React.Component {
  render() {
    return (
      <div className='dashboard'>
        <div className='dashboard__header'>
          <IconButton iconClassName='fa fa-arrow-left'
            onClick={() => hashHistory.push('/')}
          />
          <span className='flex-spacer'></span>
          <IconButton iconClassName='fa fa-bars'
             onClick={() => hashHistory.push('/dashboard')}
          />
          <IconButton iconClassName='fa fa-cog'
             onClick={() => hashHistory.push('/dashboard/setting')}
          />
        </div>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Dashboard;

