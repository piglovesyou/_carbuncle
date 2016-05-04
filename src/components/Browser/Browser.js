import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
const {DRIVER_TARGET_ID} = require('../../const');
import SvgMask from './SvgMask';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {dispatch} from '../../action';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

class Browser extends React.Component {
  render() {
    const {enableRecBtn} = this.props;
    return (
      <div className='browser'>
        <div className='browser__header'>
          <IconButton iconClassName='fa fa-arrow-left'
              tooltip='history.back()'
              tooltipPosition='bottom-right'
              onClick={this.props.onHistoryBackClick}
          ></IconButton>
          <IconButton iconClassName='fa fa-refresh'
              tooltip='location.reload()'
              onClick={this.props.onLocationReloadClick}
          ></IconButton>
          <form className='browser__header-location-form'
              onSubmit={this.props.onLocationTextSubmit}
          >
            <TextField className='browser__location-input'
                name='_'
                ref={el => { if (el) this.locationInput_ = ReactDOM.findDOMNode(el).querySelector('input'); }}
                placeholder='Target url'
            ></TextField>
          </form>
          <IconButton
              className='browser__rec-btn'
              iconClassName='fa fa-circle'
              tooltip={this.props.disablePageMove ? 'Stop recording' : 'Start recording'}
              onClick={enableRecBtn ? this.onRecordButtonClick.bind(this) : null}
              disabled={!enableRecBtn}
          ></IconButton>
          <IconButton
              disabled={this.props.disablePageMove}
              iconClassName='fa fa-bars'
              tooltip={!this.props.disablePageMove ? 'Go testcases' : null}
              onClick={!this.props.disablePageMove ? () => hashHistory.push('dashboard') : null}
          ></IconButton>
        </div>
        <div className='browser__body'>
          <iframe id={DRIVER_TARGET_ID}
            ref='iframe'
            src={this.props.location}
            onLoad={this.props.onIFrameLoaded}
            className='browser__iframe'
          />
          <ReactCSSTransitionGroup
              transitionName='svg-mask'
              transitionEnterTimeout={100}
              transitionLeaveTimeout={100}
          >
            {this.props.spotRect
              ? <SvgMask {...this.props.spotRect} />
              : null}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }

  onRecordButtonClick(e) {
    dispatch('click-recording');
  }

  get iFrameEl() {
    return this.refs.iframe;
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.refs.iframe.contentWindow.location &&
        this.props.location !== this.refs.iframe.contentWindow.location.href;
  }
  get locationInputEl() {
    return this.locationInput_;
  }

}

module.exports = Browser;

