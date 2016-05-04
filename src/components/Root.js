import React from 'react';
import Browser from './Browser';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Container} from 'flux/utils';
import Store from '../stores/root';
import {dispatchRootStateChange} from '../action';
import Snackbar from 'material-ui/Snackbar';

class Root extends React.Component {
  static getStores() {
    return [Store];
  }
  static calculateState(prevState) {
    return Store.getState();
  }
  render() {
    const isHome = this.props.location.pathname === '/';
    return (
      <div className={'application-root' + (isHome ? '' : ' application-root--dashboard')}>
        <Browser />
        <ReactCSSTransitionGroup
          component='div'
          className='dashboard-wrapper'
          transitionName='dashboard'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}
        >
          {this.props.children}
        </ReactCSSTransitionGroup>
        <Snackbar
          open={this.state.notification !== null}
          message={this.state.notification || ''}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </div>
    );
  }
  handleRequestClose() {
    this.setState({notification: null});
  }
};

module.exports = (Root);
module.exports = Container.create(Root);
