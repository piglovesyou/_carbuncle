import React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import Draggable from 'react-draggable';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Step from './Step';
import {Modes} from '../../const/browser';
import {dispatch, dispatchBrowserStateChange, saveTestCase} from '../../action';
import Executor from '../../core/executor';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class StepContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpened: false };
  }
  render() {
    const steps = this.props.testCase.map((step, i) => {
      return [
        i > 0 ? <Divider className="palette__divider" key={i} /> : null,
        <Step key={step.id}
            onTouchTap={this.handleTouchTap.bind(this, step)}
            {...step} />
      ];
    });
    return (
      <List className="palette__body" ref="palette__body">
        {this.props.isRecording || this.props.isSelecting
          ? <ReactCSSTransitionGroup
             transitionName="step"
             transitionEnterTimeout={900}
             transitionLeaveTimeout={200}
            >{steps}</ReactCSSTransitionGroup>
          : steps
        }
        <Popover
          open={this.state.isOpened}
          anchorEl={this.state.menuTargetEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          <Menu>
            <MenuItem primaryText="Remove" onTouchTap={this.handleItemRemove.bind(this)} />
            <MenuItem primaryText="Edit" onTouchTap={this.handleItemEdit.bind(this)} />
          </Menu>
        </Popover>
      </List>
    );
  }
  handleRequestClose() {
    this.closeMenu();
  }
  handleTouchTap(step, e) {
    e.preventDefault();
    this.setState({
      isOpened: true,
      menuTargetEl: e.currentTarget,
      menuTargetStep: step,
    });
  }
  handleItemRemove(e) {
    const {menuTargetStep} = this.state;
    if (!menuTargetStep) return;
    dispatch('remove-step', { step: menuTargetStep });
    this.closeMenu();
  }
  handleItemEdit(e) {
    const {menuTargetStep} = this.state;
    if (!menuTargetStep) return;
    // TODO: What we do?
    this.closeMenu();
  }
  closeMenu() {
    this.setState({
      isOpened: false,
      menuTargetEl: null,
      menuTargetStep: null,
    });
  }
}

class Palette extends React.Component {
  render() {
    return (
      <Draggable
        handle=".palette__tabs"
        start={{x: 512, y: 128}}
        ref="draggable"
      >
        <div className="palette" ref="elm">
          <Tabs className="palette__tabs"
            tabItemContainerStyle={{backgroundColor: 'lightgray'}}
            contentContainerClassName="palette__tab-container"
          >
            <Tab label="steps">
              <StepContainer {...this.props} />
            </Tab>
            <Tab label="meta">
              <TextField
                name="_"
                placeholder="Testcase title"
                tooltip="Testcase title"
                value={this.props.testCaseTitle}
                onChange={(e) => dispatchBrowserStateChange({testCaseTitle: e.target.value})}
              ></TextField>
            </Tab>
          </Tabs>
          <div className="palette__footer">
            {this.props.isRecording || this.props.isSelecting
              ? <IconButton className="step-adder__verify"
                    iconClassName="fa fa-location-arrow fa-flip-horizontal"
                    tooltip="Verify element"
                    onClick={onAddVerifyingStepClick}
                ></IconButton>
              : null}
            <IconButton className="palette__playback-btn"
                tooltip="Playback testCase"
                iconClassName="fa fa-fw fa-play"
                onClick={onPlaybackClick.bind(this)}
            ></IconButton>
            <span className="flex-spacer"></span>
            <IconButton
                tooltip="Save testCase"
                iconClassName="fa fa-fw fa-save"
                onClick={onClickSaveTestCase.bind(this)}
            ></IconButton>
          </div>
        </div>
      </Draggable>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    // if (this.props.testCase.length > prevProps.testCase.length) {
    //   scrollToBottom.call(this);
    // }
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

function onClickSaveTestCase() {
  saveTestCase({
    id: this.props.testCaseId,
    title: this.props.testCaseTitle,
    steps: this.props.testCase,
  });
}

function onAddVerifyingStepClick() {
  dispatch('click-selecting-verify-step');
}

function onPlaybackClick(e) {
  dispatchBrowserStateChange({ mode: Modes.PLAYBACKING });
  Executor.execute(this.props.testCase);
}

module.exports = Palette;

function scrollToBottom() {
  this.refs.palette__body.scrollTop = this.refs.palette__body.scrollHeight - this.refs.palette__body.offsetHeight;
}
