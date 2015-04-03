
var React = require('react');
var {HistoryLocation} = require('react-router');
var Path = require('path');

// var Item = React.createClass({
//   render() {
//     return (
//       <div className="scenario__item">
//       </div>
//     );
//   }
// });

var Scenario = React.createClass({
  render() {
    console.log(777, this.props.isBlock);
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
            <label for="scenario__block" className="helptext" title="ブロックは他のシナリオのステップにすることができます">
              <input className="scenario__block"
                     id="scenario__block"
                     type="checkbox"
                     style={{'vertical-align': 'middle'}}
                     checked={!!this.props.isBlock}
               />
              ブロック
            </label>
          </form>
        </div>
        <div className="scenario__body">
          <div className="scenario__body-container">
            {this.props.entries.map(entry => {
              return (
                <div id={entry.id} data-id={entry.id} className={'scenario-entry scenario-entry--' + entry.mode} title={entry.css}>
                  <div className="scenario-entry--left">
                    (entry.mode === 'block' ? <a className="scenario-entry--edithook" href="">edit</a> : null)
                    <a className="scenario-entry--deletehook" href="">del</a>
                  </div>
                  {entry.title}
                  <div className="scenario-entry--meta">
                    {entry.mode}
                    {entry.type ? ', ' + entry.type : ''}
                    {entry.text ? ', ' + entry.text : ''}
                  </div>
                </div>
              );
            })}
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

function pushState(path) {
  return function(e) {
    e.preventDefault();
    HistoryLocation.push(Path.join(__dirname, path));
  };
}
