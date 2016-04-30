import React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col-lg-6">
            <div className="input-group input-group-lg">
              <span className="input-group-btn">
                <button className="btn btn-link" onClick={() => hashHistory.push('/')}>
                  <i className="fa fa-arrow-left"></i>&nbsp;Browser
                </button>
              </span>
              <span className="flex-spacer"></span>
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={() => hashHistory.push('/dashboard')}>
                  <i className="fa fa-bars"></i>
                </button>
                <button className="btn btn-default" onClick={() => hashHistory.push('/dashboard/setting')}>
                  <i className="fa fa-cog"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Dashboard;

