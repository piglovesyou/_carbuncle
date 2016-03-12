
const React = require('react');
const Actions = require('../actions');
const helper = require('./helper');

const Entry = React.createClass({
  render() {
    return (
      <div id={this.props.id}
           data-id={this.props.id}
           className={this.createClassNames()}
           title={this.props.css}>
        <div className='scenario-entry__right'>
          {this.props.mode !== 'block'
              ? <a className='scenario-entry__edithook'
                 onClick={this.onEditClick}
                 href='#'>edit</a>
              : null}
          {this.props.mode !== 'block' ? <br /> : null}
          <a className='scenario-entry__deletehook'
             onClick={this.onDeleteClick}
             href='#'>del</a>
        </div>
        <div className='scenario-entry__title' title={this.props.title}>
          {helper.renderIcon(this.props.isBlock, this.props.mode, this.props.type)}
          {goog.string.truncate(this.props.title, 20)}
        </div>
        <div className='scenario-entry__meta'>
          {this.renderMeta()}
        </div>
      </div>
    );
  },
  renderMeta() {
    var rv = [<span>{this.props.type}</span>];
    if (this.props.mode === 'action' &&
        this.props.type === 'open' &&
        goog.string.linkify.findFirstUrl(this.props.text)) {
      rv.push(<a href='#'
                 onClick={this.onUrlClick}>{this.props.text}</a>);
    } else {
      rv.push(<span>{this.props.text}</span>);
    }
    return rv;
  },
  onUrlClick(e) {
    e.preventDefault();
    Actions.locationChange({
      url: this.props.text
    });
  },
  createClassNames() {
    var rv = 'scenario-entry';
    if (this.props.mode) rv += ' scenario-entry--' + this.props.mode;
    if (this.props['@executingState']) rv += ' scenario-entry--' + this.props['@executingState'];
    return rv;
  },
  onEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    Actions.startEditEntry(this.props);
  },
  onDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    Actions.deleteEntry(this.props.id);
  }
});

const Scenario = React.createClass({
  componentDidUpdate() {
    var container = this.refs['body'].getDOMNode();
    var doing = container.querySelector('.scenario-entry--doing');
    if (doing) {
      container.scrollTop = goog.style.getContainerOffsetToScrollInto(doing, container, true).y;
    }
  },
  render() {
    return (
      <div className='scenario'>
        <div className='scenario__header'>
          <form action='' className='form-horizontal' onSubmit={this.onSave}>
            <input className='scenario__id' type='hidden'
                   value={this.props._id || null} />
            <div className='form-group'>
              <div className='col-xs-11'>
                <input className='scenario__title form-control'
                       ref='scenario__title'
                       type='text'
                       title='シナリオのタイトル'
                       placeholder='シナリオのタイトル'
                       value={this.props.title}
                       onChange={this.onChange}
                       />
              </div>
              <label htmlFor='scenario__block' className='control-label col-xs-1' title='ブロックは他のシナリオのステップにすることができます'>
                <input ref='scenario__block'
                       className='scenario__block'
                       id='scenario__block'
                       type='checkbox'
                       checked={!!this.props.isBlock}
                       onChange={this.onBlockChange}
                 />
                <i className='fa fa-cube'></i>
              </label>
            </div>
          </form>
        </div>
        <div className='scenario__body' ref='body'>
          {this.props.entries.map(entry => <Entry {...entry} key={entry.id} />)}
          <div className='scenario__body-insertblock-wrap'>
            <a className='scenario__body-insertblock' href='#' onClick={this.onBlockSelectClick}>
              <i className='fa fa-plus'></i>
              ブロックを挿入
            </a>
          </div>
        </div>
        <div className='scenario__footer'>
          <a onClick={!this.props.disabled ? this.onPreviewClick : function() {}}
             className={'btn btn-success scenario__footer-preview' + (this.props.disabled ? ' btn-disabled' : '')}
             href='#'><i className='fa fa-rocket'></i> 試す</a>&nbsp;
          <a onClick={!this.props.disabled ? this.onNewClick : function() {}}
             className={'btn btn-danger scenario__footer-create' + (this.props.disabled ? ' btn-disabled' : '')}
             href='#'><i className='fa fa-file-text'></i> 新規</a>&nbsp;
          <a onClick={!this.props.disabled ? this.onSave : function() {}}
             className={'btn btn-primary scenario__footer-save' + (this.props.disabled ? ' btn-disabled' : '')}
             href='#'><i className='fa fa-hdd-o'></i> 保存</a>
        </div>

      </div>
    );
  },

  onBlockSelectClick(e) {
    e.preventDefault();
    Actions.startBlockSelect(true);
  },

  onSave(e) {
    e.preventDefault(e);
    Actions.saveScenario();
  },

  onNewClick(e) {
    e.preventDefault(e);
    Actions.newScenario();
  },

  onBlockChange() {
    Actions.changeScenario({
      isBlock: !!goog.dom.forms.getValue(this.refs['scenario__block'].getDOMNode())
    });
  },

  onChange(e) {
    e.preventDefault(e);
    Actions.changeScenario({
      title: goog.dom.forms.getValue(this.refs['scenario__title'].getDOMNode()),
      isBlock: !!goog.dom.forms.getValue(this.refs['scenario__block'].getDOMNode())
    });
  },

  onPreviewClick() {
    Actions.preview();
  }

});

Scenario.propTypes = {
  id: React.PropTypes.string
};

module.exports = Scenario;
