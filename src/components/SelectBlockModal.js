var React = require('react');
var Actions = require('../actions');

var SelectBlockModal = React.createClass({
  render() {
    return (
      <div>
        <div className={'effeckt-wrap effeckt-modal-wrap from-below' +
            (this.props.shown ? ' effeckt-show' : '')} id="effeckt-modal-wrap">
          <div className="effeckt-content effeckt-modal" id="effeckt-modal">
            <h3>Modal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal DialogModal Dialog</h3>
            <div className="effeckt-modal-content">
              <p>This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.This is a modal window.</p>
              <button className="effeckt-modal-close">Close me!</button>
            </div>
          </div>
        </div>
        <div className="effeckt-overlay effeckt-modal-overlay"
             id="effeckt-modal-overlay"
             data-effeckt-dismiss="modal"
             onClick={this.onCancelClick}
        ></div>
      </div>
    );
  },

  onCancelClick(e) {
    e.preventDefault();
    Actions.startBlockSelect(false);
  }
});

module.exports = SelectBlockModal;
