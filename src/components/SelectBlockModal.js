var React = require('react');
var Actions = require('../actions');
var ScenarioListComponent = require('../components/ScenarioList');
var BlockList = require('../stores/BlockList');

var SelectBlockModal = React.createClass({
  render() {
    return (
      <div>
        <div className={'effeckt-wrap effeckt-modal-wrap from-below' +
            (this.props.shown ? ' effeckt-show' : '')} id="effeckt-modal-wrap">
          <div className="effeckt-content effeckt-modal" id="effeckt-modal">
            <h3>ブロックを選択...</h3>
            <div className="effeckt-modal-content">
              {this.props.shown ?
                <ScenarioListComponent
                    store={BlockList}
                    cssModifier="scenario-list"
                    onClickRow={this.onClickRow}
                    />
              : null}
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

  onClickRow(rowData) {
    Actions.insertEntry(rowData);
    Actions.startBlockSelect(false);
  },

  onCancelClick(e) {
    e.preventDefault();
    Actions.startBlockSelect(false);
  }
});

module.exports = SelectBlockModal;
