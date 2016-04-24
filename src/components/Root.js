const React = require('react');
const Browser = require('./Browser');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Root extends React.Component {
  render() {
    const isHome = this.props.location.pathname === '/';
    return (
      <div className={'application-root' + (isHome ? '' : ' application-root--dashboard')}>
        <Browser />
        <ReactCSSTransitionGroup
          component="div"
          className="dashboard-wrapper"
          transitionName="dashboard"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}
        >
          {this.props.children}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
};

module.exports = Root;
