const React = require('react');
const Browser = require('./Browser');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Root extends React.Component {
  render() {
    const isHome = this.props.location.pathname === '/';
    console.log(this.props, isHome);
    return (
      <div className={'application-root' + (isHome ? '' : ' application-root--dashboard')}>
        <Browser />
        <ReactCSSTransitionGroup
          component="div"
          className="dashboard-wrapper"
          transitionName="dashboard"
          transitionEnterTimeout={1200}
          transitionLeaveTimeout={1200}
        >
          {this.props.children}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
};

module.exports = Root;
