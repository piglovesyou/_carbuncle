
var React = require('react');
var Actions = require('../actions');

var Entry = React.createClass({
  render() {
    return (
      <div id={this.props.id}
           data-id={this.props.id}
           className={'scenario-entry scenario-entry--' + this.props.mode}
           title={this.props.css}>
        <div className="scenario-entry__right">
          {this.props.mode !== 'block' ?
              <a className="scenario-entry__edithook"
                 onClick={this.onEditClick}
                 href="#">edit</a> : null}
          {this.props.mode !== 'block' ? <br /> : null}
          <a className="scenario-entry__deletehook"
             onClick={this.onDeleteClick}
             href="#">del</a>
        </div>
        <div className="scenario-entry__title">
          {this.renderIcon()}
          {this.props.title}
        </div>
        <div className="scenario-entry__meta">
          {this.props.mode}
          {this.props.type ? ', ' + this.props.type : ''}
          {this.props.text ? ', ' + this.props.text : ''}
        </div>
      </div>
    );
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
  },
  renderIcon() {
    var iconKey;
    if (this.props.mode === 'action') {
      switch(this.props.type) {
        case 'click': iconKey = 'bullseye'; break;
        case 'input': iconKey = 'pencil'; break;
        case 'open': iconKey = 'globe'; break;
        case 'screenshot': iconKey = 'camera'; break;
      }
    } else if (this.props.mode === 'verify') {
      iconKey = 'check-square-o';
    } else if (this.props.mode === 'block') {
      iconKey = 'cube';
    }
    if (iconKey) {
      return <i className={'fa fa-' + iconKey}></i>;
    }
    return null;
  }
});

var Scenario = React.createClass({
  render() {
    return (
      <div className="scenario">
        <div className="scenario__header">
          <form action="" className="pure-form">
            <input className="scenario__id" type="hidden"
                   value={this.props._id || null} />
            <input className="scenario__title form-control"
                   ref="scenario__title"
                   type="text"
                   title="シナリオのタイトル"
                   placeholder="シナリオのタイトル"
                   value={this.props.title}
                   onChange={this.onChange}
                   />
            <label htmlFor="scenario__block" className="helptext" title="ブロックは他のシナリオのステップにすることができます">
              <input ref="scenario__block"
                     className="scenario__block"
                     id="scenario__block"
                     type="checkbox"
                     checked={!!this.props.isBlock}
                     onChange={this.onChange}
               />
              ブロック
            </label>
          </form>
        </div>
        <div className="scenario__body">
          <div className="scenario__body-container">
            {this.props.entries.map(entry => <Entry {...entry} key={entry.id} />)}
          </div>
          <div className="scenario__body-insertblock-wrap">
            <a className="scenario__body-insertblock" href="">
              <i className="fa fa-plus"></i>
              ブロックを挿入
            </a>
          </div>
        </div>
        <div className="scenario__footer">
          <a onClick={!this.props.disabled ? this.onPreviewClick : function(){}}
             className={'btn btn-success scenario__footer-preview' + (this.props.disabled ? ' btn-disabled' : '')}
             href="#">試す</a>&nbsp;
          <a onClick={!this.props.disabled ? this.onPreviewClick : function(){}}
             className={'btn btn-danger scenario__footer-create' + (this.props.disabled ? ' btn-disabled' : '')}
             href="">新規</a>&nbsp;
          <a onClick={!this.props.disabled ? this.onSaveClick : function(){}}
             className={'btn btn-primary scenario__footer-save' + (this.props.disabled ? ' btn-disabled' : '')}
             href="">保存</a>
        </div>

      </div>
    );
  },

  onSaveClick(e) {
    e.preventDefault(e);
    Actions.saveScenario();
  },

  onChange(e) {
    e.preventDefault(e);
    Actions.changeScenario({
      title: goog.dom.forms.getValue(this.refs['scenario__title'].getDOMNode()),
      isBlock: goog.dom.forms.getValue(this.refs['scenario__block'].getDOMNode())
    });
  },

  onPreviewClick() {
    Actions.preview();
  }

});
module.exports = Scenario;
