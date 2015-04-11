
var React = require('react');
var Nav = require('../components/Nav');
var Actions = require('../actions');
var assert = require('assert');

var Setting = React.createClass({

  render() {
    return (
      <div className="app-root app-root--setting">
        <Nav />
        <div className="layout-scrolable">
          <div className="container" style={{width: 800}}>
            <h2 className="app-root__pagetitle">Setting</h2>
            <form action="#" className="form-horizontal">

              <div className="form-group">
                <label className="col-xs-3 control-label" htmlFor="database">データベース</label>
                <div className="col-xs-7">
                  <input className="form-control"
                         type="text"
                         id="database"
                         placeholder="mongodb://127.0.0.1:27017/dbname"
                         defaultValue="mongodb://127.0.0.1:27017/carbuncle"
                         onChange={this.onChange} />
                </div>
                <div className="col-xs-2">
                  <i className="fa fa-check"></i>
                </div>
              </div>

              <div className="form-group">
                <label className="col-xs-3 control-label" htmlFor="username">ユーザー名</label>
                <div className="col-xs-7">
                  <input className="form-control"
                         type="text"
                         id="username"
                         placeholder="piglovesyou"
                         onChange={this.onChange} />
                </div>
                <div className="col-xs-2">
                  <i className="fa fa-check"></i>
                </div>
              </div>

              <div className="form-group">
                <label className="col-xs-3 control-label" htmlFor="password">パスワード</label>
                <div className="col-xs-7">
                  <input className="form-control"
                         type="text"
                         id="password"
                         placeholder="●●●●●●●"
                         onChange={this.onChange} />
                </div>
                <div className="col-xs-2">
                  <i className="fa fa-close"></i>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  },

  onChange(e) {
    var form = {};
    var name = e.target.id;
    var value = goog.dom.forms.getValue(e.target);
    assert(~['database', 'username', 'password'].indexOf(name));
    form[name] = value;
    Actions.changeSetting(form);
  }

});

module.exports = Setting;
