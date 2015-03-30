var React = require('react');

var Editor = React.createClass({

  getInitialState() {
    return {
      id: '',
      mode: 'action',
      type: 'click'
    };
  },

  render() {
    return (
      <div className="editor">
        <form action="" className="editor-form form-horizontal">
          <input type="hidden" />
          <div className="editor-topinputs form-group">
            <div className="col-xs-5">
              <input name="entry-title" className="entry-title form-control" value={this.state.title || ''} type="text" placeholder="ステップのタイトル" />
            </div>
            <div className="col-xs-7">
              <textarea className="entry-css form-control" name="entry-css" rows="1" placeholder="CSSセレクタ" defaultValue={this.state.css || ''}></textarea>
            </div>
          </div>
          <div className="editor-bottominputs form-group">
            {this.renderPulldowns_()}

          </div>
        </form>
      </div>
    );
  },

  renderPulldowns_() {
    var out = [];
    var textPlaceHolder = this.state.mode === 'verify' ? '文字列' :
                this.state.type === 'input' ? '文字列' :
                this.state.type === 'open' ? 'ページURL' : null;
    out.push(
      <a className="selector-button btn btn-danger" href="#" onClick={this.props.onStartSelectElement}>
        <i className="fa fa-location-arrow fa-flip-horizontal fa-lg"></i>
        &nbsp;要素を選択
      </a>
    );
    out.push(
      <div className="col-xs-2">
        <select name="entry-mode" ref="entry-mode" className="entry-mode form-control" onChange={this.onChange}>
          <option value="action" defaultValue={this.state.mode === 'action'}>アクション</option>
          <option value="verify" defaultValue={this.state.mode === 'verify'}>ベリファイ</option>
        </select>
      </div>
    );
    if (this.state.mode === 'action') {
      out.push(
        <div className="col-xs-2">
          <select name="entry-type" ref="entry-type" className="entry-type entry-type-action form-control" onChange={this.onChange}>
            <option value="click" defaultValue={this.state.type === 'click'}>クリック</option>
            <option value="input" defaultValue={this.state.type === 'input'}>入力</option>
            <option value="open" defaultValue={this.state.type === 'open'}>ページを開く</option>
            <option value="screenshot" defaultValue={this.state.type === 'screenshot'}>撮影</option>
          </select>
        </div>
      );
    } else {
      out.push(
        <div className="col-xs-2">
          <select name="entry-type" ref="entry-type" className="entry-type entry-type-verify form-control">
            <option value="contains" defaultValue={this.state.type === 'contains'}>を含む</option>
            <option value="startswith" defaultValue={this.state.type === 'startswith'}>で始まる</option>
            <option value="endswith" defaultValue={this.state.type === 'endswith'}>で終わる</option>
            <option value="equal" defaultValue={this.state.type === 'equal'}>と一致</option>
          </select>
        </div>
      );
    }
    if (textPlaceHolder) {
      out.push(
        <div className="col-xs-4">
          <input name="entry-text" ref="entry-text"
                 className="entry-text form-control"
                 value={this.state.text || ''}
                 type="text"
                 placeholder={textPlaceHolder}
                 disabled={this.state.mode === 'action' && (this.state.type === 'click' || this.state.type === 'screenshot')} />
        </div>
      );
    }
    out.push(
      <button className={'append-button btn ' + (this.state.isEdit ? 'btn-success' : 'btn-primary')}>
        あああ
      </button>
    );
    out.push(
      <a className="quit-edit-button btn btn-link"
         title="quit editing"
         href="#"
      >やめる</a>
    );
    return out;
  },

  onChange() {
    this.setState({
      mode: goog.dom.forms.getValue(this.refs['entry-mode'].getDOMNode()),
      type: goog.dom.forms.getValue(this.refs['entry-type'].getDOMNode())
    });
  }
});

module.exports = Editor;
