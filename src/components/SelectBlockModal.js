const React = require('react');
const Actions = require('../actions');
const ScenarioListComponent = require('../components/ScenarioList');
const BlockList = require('../stores/BlockList');

class SelectBlockModal extends React.Component {
  render() {
    return (
      <div>
        <div className={'effeckt-wrap effeckt-modal-wrap from-below' +
            (this.props.shown ? ' effeckt-show' : '')} id='effeckt-modal-wrap'>
          <div className='effeckt-content effeckt-modal' id='effeckt-modal'>
            <h3>ブロックを選択...</h3>
            <div className='effeckt-modal-content'>
              {this.props.shown
                ? <ScenarioListComponent
                    store={BlockList}
                    cssModifier='scenario-list'
                    onClickRow={this.onClickRow}
                  />
                : null}
            </div>
          </div>
        </div>
        <div className='effeckt-overlay effeckt-modal-overlay'
             id='effeckt-modal-overlay'
             data-effeckt-dismiss='modal'
             onClick={this.onCancelClick}
        ></div>
      </div>
    );
  }

  onClickRow(rowData) {
    Actions.insertEntry(rowData);
    Actions.startBlockSelect(false);
  }

  onCancelClick(e) {
    e.preventDefault();
    Actions.startBlockSelect(false);
  }
}

SelectBlockModal.propTypes = {
  data: React.PropTypes.object,
  shown: React.PropTypes.boolean
};

module.exports = SelectBlockModal;
