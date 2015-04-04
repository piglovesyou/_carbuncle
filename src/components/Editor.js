var React = require('react');
var Actions = require('../actions');

var Editor = React.createClass({

  render() {
    return (
      <div className="editor">
        <form action=""
              className="editor-form form-horizontal"
              onSubmit={this.onSubmit}
              >
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
                        name="entry-css"
                        className="entry-css form-control"
                        value={this.props.css}
                        onChange={this.onCssChange}
                        rows="1"
                        placeholder="CSSセレクタ"
                        ></textarea>
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
        <select name="entry-mode"
                ref="entry-mode"
                className="entry-mode form-control"
                onChange={this.onSelectChange}
                value={this.props.mode}>
          <option value="action">アクション</option>
          <option value="verify">ベリファイ</option>
        </select>
      </div>
    );
    if (this.props.mode === 'action') {
      out.push(
        <div className="col-xs-2" key={out.length}>
          <select name="entry-type"
                  ref="entry-type"
                  className="entry-type entry-type-action form-control"
                  onChange={this.onSelectChange}
                  value={this.props.type}>
            <option value="click">クリック</option>
            <option value="input">入力</option>
            <option value="open">ページを開く</option>
            <option value="screenshot">撮影</option>
          </select>
        </div>
      );
    } else {
      out.push(
        <div className="col-xs-2" key={out.length}>
          <select name="entry-type"
                  ref="entry-type"
                  className="entry-type entry-type-verify form-control"
                  value={this.props.type}>
            <option value="contains">を含む</option>
            <option value="startswith">で始まる</option>
            <option value="endswith">で終わる</option>
            <option value="equal">と一致</option>
          </select>
        </div>
      );
    }
    if (textPlaceHolder) {
      out.push(
        <div className="col-xs-4" key={out.length}>
          <input ref="entry-text"
                 name="entry-text"
                 className="entry-text form-control"
                 value={this.props.text || ''}
                 onChange={this.onTextChange}
                 type="text"
                 placeholder={textPlaceHolder}
                 disabled={this.props.mode === 'action' && (this.props.type === 'click' || this.props.type === 'screenshot')}
                 />
        </div>
      );
    }
    out.push(
      <button className={'append-button btn' + (this.props.isEdit ? ' btn-success' : ' btn-primary')} key={out.length}>
        {(this.props.isEdit ? '編集' : '作成')}
      </button>
    );
    if (this.props.isEdit) {
      out.push(
        <a className="quit-edit-button btn btn-link"
           title="quit editing"
           href="#"
           key={out.length}
        >やめる</a>
      );
    }
    return out;
  },

  onTitleChange() {
    Actions.editorChange({
      title: goog.dom.forms.getValue(this.refs['entry-title'].getDOMNode())
    });
  },

  onCssChange() {
    Actions.editorChange({
      css: goog.dom.forms.getValue(this.refs['entry-css'].getDOMNode())
    });
  },

  onTextChange() {
    Actions.editorChange({
      text: this.refs['entry-text'] ? goog.dom.forms.getValue(this.refs['entry-text'].getDOMNode()) : null
    });
  },

  onSelectChange() {
    Actions.editorChange({
      mode: goog.dom.forms.getValue(this.refs['entry-mode'].getDOMNode()),
      type: goog.dom.forms.getValue(this.refs['entry-type'].getDOMNode())
    });
  },

  onSubmit(e) {
    e.preventDefault();
    (this.props.isEdit ? Actions.editEntry : Actions.insertEntry)({
      id: this.props.isEdit ? this.props.id : null,
      title: goog.dom.forms.getValue(this.refs['entry-title'].getDOMNode()),
      css: goog.dom.forms.getValue(this.refs['entry-css'].getDOMNode()),
      mode: goog.dom.forms.getValue(this.refs['entry-mode'].getDOMNode()),
      type: goog.dom.forms.getValue(this.refs['entry-type'].getDOMNode()),
      text: this.refs['entry-text'] ? goog.dom.forms.getValue(this.refs['entry-text'].getDOMNode()) : null
    });
  },

  onStartSelectElement(e) {
    e.preventDefault();
    Actions.enableSelectElement(true);
  }

});

module.exports = Editor;
