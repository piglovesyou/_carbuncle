
const React = require('react');
const Nav = require('../components/Nav');
const Actions = require('../actions');
const SettingState = require('../stores/SettingState');

const Setting = React.createClass({

  componentDidMount() {
    SettingState.addChangeListener(this.onStateChange);
    SettingState.authenticate();
  },

  componentWillUnmount() {
    SettingState.removeChangeListener(this.onStateChange);
  },

  getInitialState() {
    return SettingState.get();
  },

  onStateChange() {
    this.setState(SettingState.get());
  },

  render() {
    return (
      <div className='app-root app-root--setting'>
        <Nav />
        <div className='layout-scrolable'>
          <div className='container'>
            <h2 className='app-root__pagetitle'>個人設定</h2>
            <form action='#' className='form-horizontal'>

              <div className='form-group'>
                <label className='col-xs-3 control-label' htmlFor='database'>データベース</label>
                <div className='col-xs-7'>
                  <input className='form-control'
                         type='text'
                         ref='database'
                         id='database'
                         placeholder='mongodb://127.0.0.1:27017/name'
                         defaultValue={window.localStorage.database}
                         onChange={this.onChange} />
                </div>
                <label className='col-xs-2 control-label' htmlFor='database'>
                  {this.createOkOrNgIcon(this.state.databaseConnected)}
                </label>
              </div>

              <div className='form-group'>
                <label className='col-xs-3 control-label' htmlFor='username'>ユーザー名</label>
                <div className='col-xs-7'>
                  <input className='form-control'
                         type='text'
                         ref='username'
                         id='username'
                         placeholder='Username'
                         defaultValue={window.localStorage.username}
                         onChange={this.onChange} />
                </div>
                <label className='col-xs-2 control-label' htmlFor='username'>
                  {this.createOkOrNgIcon(this.state.authenticated)}
                </label>
              </div>

              <div className='form-group'>
                <label className='col-xs-3 control-label' htmlFor='password'>パスワード</label>
                <div className='col-xs-7'>
                  <input className='form-control'
                         type='password'
                         ref='password'
                         id='password'
                         defaultValue={window.localStorage.password}
                         placeholder='●●●●●●●'
                         onChange={this.onChange} />
                </div>
                <label className='col-xs-2 control-label' htmlFor='password'>
                  {this.createOkOrNgIcon(this.state.authenticated)}
                </label>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  },

  createOkOrNgIcon(ok) {
    return ok === true
        ? <i className='fa fa-check'></i>
        : ok === false
        ? <i className='fa fa-close'></i>
        : null;
  },

  onChange(e) {
    e.preventDefault();
    Actions.changeSetting({
      database: goog.dom.forms.getValue(this.refs.database),
      username: goog.dom.forms.getValue(this.refs.username),
      password: goog.dom.forms.getValue(this.refs.password)
    });
  }

});

module.exports = Setting;
