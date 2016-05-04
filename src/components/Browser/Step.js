import React from 'react';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';

class Step extends React.Component {
  render() {
    const className = 'step' +
        (this.props.isSuccessfullyExecuted_ === true
          ? ' step--is-succeeded'
          : this.props.isSuccessfullyExecuted_ === false
          ? ' step--is-failed'
          : '');
    return (
      <ListItem className={className} onTouchTap={this.props.onTouchTap}>
        <div className='step__buttons'>
          {this.props.onStepRemoveClicked
            ? <IconButton className=''
                onClick={this.props.onStepRemoveClicked}
                title='Remove this step'
                iconClassName='fa fa-trash'
              ></IconButton>
            : null}
        </div>
        <div className='step__content'>

          <div className='step__name'>
            {this.props.type.name}
          </div>
          <div className='step__value'>
            {this.renderValue()}
          </div>

        </div>
      </ListItem>
    );
  }

  renderValue() {
    if (this.props.url) {
      return this.props.url;
    }
    if (this.props.text) {
      if (/^\n$/.test(this.props.text)) {
        return 'Enter';
      }
      return this.props.text;
    }
    if (this.props.locator) {
      return `${this.props.locator.getName()}: ${this.props.locator.getValue()}`;
    }
    return null;
  }
};

module.exports = Step;
