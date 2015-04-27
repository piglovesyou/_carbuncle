var React = require('react');
var Actions = require('../actions');
var ScenarioListComponent = require('../components/ScenarioList');

var SelectBlockModal = React.createClass({
  render() {
    return (
      <div>
        <div className={'effeckt-wrap effeckt-modal-wrap from-below' +
            (this.props.shown ? ' effeckt-show' : '')} id="effeckt-modal-wrap">
          <div className="effeckt-content effeckt-modal" id="effeckt-modal">
            <h3>ブロックを選択...</h3>
            <div className="effeckt-modal-content">
              {this.props.shown ? <ScenarioListComponent cssModifier="scenario-list" /> : null}
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
