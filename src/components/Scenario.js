
var React = require('react');
var {HistoryLocation} = require('react-router');
var Path = require('path');
var Actions = require('../actions');

var Entry = React.createClass({
  render() {
    return (
      <div id={this.props.id} data-id={this.props.id} key={this.props.id} className={'scenario-entry scenario-entry--' + this.props.mode} title={this.props.css}>
        <div className="scenario-entry__right">
          {this.props.mode !== 'block' ? <a className="scenario-entry__edithook" href="">edit</a> : null}
          {this.props.mode !== 'block' ? <br /> : null}
          <a className="scenario-entry__deletehook" onClick={this.onDeleteClick} href="#">del</a>
        </div>
        <div className="scenario-entry__title">{this.props.title}</div>
        <div className="scenario-entry__meta">
          {this.props.mode}
          {this.props.type ? ', ' + this.props.type : ''}
          {this.props.text ? ', ' + this.props.text : ''}
        </div>
      </div>
    );
  },
  onDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    Actions.deleteEntry(this.props.id);
  }
});

var Scenario = React.createClass({
  render() {
    return (
      <div className="scenario">
        <div className="scenario__header">
          <form action="" className="pure-form">
            <input className="scenario__id" type="hidden"
                   value={this.props.id || null} />
            <input className="scenario__title form-control"
                   type="text"
                   title="シナリオのタイトル"
                   placeholder="シナリオのタイトル"
                   />
            <label htmlFor="scenario__block" className="helptext" title="ブロックは他のシナリオのステップにすることができます">
              <input className="scenario__block"
                     id="scenario__block"
                     type="checkbox"
                     checked={!!this.props.isBlock}
               />
              ブロック
            </label>
          </form>
        </div>
        <div className="scenario__body">
          <div className="scenario__body-container">
            {this.props.entries.map(entry => <Entry {...entry} />)}
          </div>
          <div className="scenario__body-insertblock-wrap">
            <a className="scenario__body-insertblock" href="">
              <i className="fa fa-plus"></i>
              ブロックを挿入
            </a>
          </div>
        </div>
        <div className="scenario__footer">
          <a className={'btn btn-success scenario__footer-preview' + (this.props.disabled ? ' btn-disabled' : '')} href="">試す</a>&nbsp;
          <a className={'btn btn-danger scenario__footer-create' + (this.props.disabled ? ' btn-disabled' : '')} href="">新規</a>&nbsp;
          <a className={'btn btn-primary scenario__footer-save' + (this.props.disabled ? ' btn-disabled' : '')} href="">保存</a>
        </div>

      </div>
    );
  }
});
module.exports = Scenario;
