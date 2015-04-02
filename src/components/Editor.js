var React = require('react');
var Actions = require('../actions');

var Editor = React.createClass({

  // getInitialState() {
  //   return {
  //     title: '',
  //     css: '',
  //     id: '',
  //     mode: 'action',
  //     type: 'click'
  //   };
  // },

  // componentWillReceiveProps(props) {
  //   var state = {};
  //   if (props.roughTitle) state.title = props.roughTitle;
  //   if (props.selectorText) state.css = props.selectorText;
  //   this.setState(state);
  // },

  render() {
    return (
      <div className="editor">
        <form action="" className="editor-form form-horizontal">
          <input type="hidden" />
          <div className="editor-topinputs form-group">
            <div className="col-xs-5">
              <input ref="entry-title"
                     name="entry-title"
                     className="entry-title form-control"
                     value={this.props.title}
                     onChange={this.onTitleChange}
                     type="text"
                     placeholder="ステップのタイトル" />
            </div>
            <div className="col-xs-7">
              <textarea ref="entry-css"
                        className="entry-css form-control"
                        name="entry-css"
                        rows="1"
                        placeholder="CSSセレクタ"
                        value={this.props.css}
                        onChange={this.onCssChange}></textarea>
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
    var textPlaceHolder = this.props.mode === 'verify' ? '文字列' :
                this.props.type === 'input' ? '文字列' :
                this.props.type === 'open' ? 'ページURL' : null;
    out.push(
      <a className="selector-button btn btn-danger" href="#" onClick={this.onStartSelectElement} key={out.length}>
        <i className="fa fa-location-arrow fa-flip-horizontal fa-lg"></i>
        &nbsp;要素を選択
      </a>
    );
    out.push(
      <div className="col-xs-2" key={out.length}>
        <select name="entry-mode" ref="entry-mode" className="entry-mode form-control" onChange={this.onSelectChange}>
          <option value="action" defaultValue={this.props.mode === 'action'}>アクション</option>
          <option value="verify" defaultValue={this.props.mode === 'verify'}>ベリファイ</option>
        </select>
      </div>
    );
    if (this.props.mode === 'action') {
      out.push(
        <div className="col-xs-2" key={out.length}>
          <select name="entry-type" ref="entry-type" className="entry-type entry-type-action form-control" onChange={this.onSelectChange}>
            <option value="click" defaultValue={this.props.type === 'click'}>クリック</option>
            <option value="input" defaultValue={this.props.type === 'input'}>入力</option>
            <option value="open" defaultValue={this.props.type === 'open'}>ページを開く</option>
            <option value="screenshot" defaultValue={this.props.type === 'screenshot'}>撮影</option>
          </select>
        </div>
      );
    } else {
      out.push(
        <div className="col-xs-2" key={out.length}>
          <select name="entry-type" ref="entry-type" className="entry-type entry-type-verify form-control">
            <option value="contains" defaultValue={this.props.type === 'contains'}>を含む</option>
            <option value="startswith" defaultValue={this.props.type === 'startswith'}>で始まる</option>
            <option value="endswith" defaultValue={this.props.type === 'endswith'}>で終わる</option>
            <option value="equal" defaultValue={this.props.type === 'equal'}>と一致</option>
          </select>
        </div>
      );
    }
    if (textPlaceHolder) {
      out.push(
        <div className="col-xs-4" key={out.length}>
          <input name="entry-text" ref="entry-text"
                 className="entry-text form-control"
                 value={this.props.text || ''}
                 type="text"
                 placeholder={textPlaceHolder}
                 disabled={this.props.mode === 'action' && (this.props.type === 'click' || this.props.type === 'screenshot')} />
        </div>
      );
    }
    out.push(
      <button className={'append-button btn ' + (this.props.isEdit ? 'btn-success' : 'btn-primary')} key={out.length}>
        あああ
      </button>
    );
    out.push(
      <a className="quit-edit-button btn btn-link"
         title="quit editing"
         href="#"
         key={out.length}
      >やめる</a>
    );
    return out;
  },

  onChange() {
  },

  onTitleChange() {
    Actions.editorChange({
      title: this.refs['entry-title'].getDOMNode().value
    });
  },

  onCssChange() {
    Actions.editorChange({
      css: this.refs['entry-css'].getDOMNode().value
    });
  },

  onSelectChange() {
    Actions.editorChange({
      mode: goog.dom.forms.getValue(this.refs['entry-mode'].getDOMNode()),
      type: goog.dom.forms.getValue(this.refs['entry-type'].getDOMNode())
    });
  },

  onStartSelectElement(e) {
    e.preventDefault();
    Actions.enableSelectElement(true);
  }

});

module.exports = Editor;
