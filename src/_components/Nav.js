const React = require('react');
const {Link, State} = require('react-router');
const NotifyState = require('../stores/NotifyState');
const Actions = require('../actions');

const Notification = React.createClass({
  getInitialState() {
    return NotifyState.get();
  },
  componentDidMount() {
    NotifyState.addChangeListener(this.onChange);
  },
  componentWillUnmount() {
    NotifyState.removeChangeListener(this.onChange);
  },
  onChange() {
    this.replaceState(NotifyState.get());
  },
  render() {
    const icon = this.state.icon ? <i className={'fa fa-' + this.state.icon}></i> : null;
    const message = goog.string.truncate(this.state.message || '', 20);
    const content = this.state.linkUrl
        ? <Link to={this.state.linkUrl} className='alert'>{icon} {message}</Link>
        : <span className={'alert' + (this.state.type ? ' alert-' + this.state.type : '')}>{icon} {message}</span>;
    return (
      <li className={'navbar__notification' + (this.state.active ? ' active' : '')}
          onClick={this.state.active ? this.onNotifyClick : function() {}}>
        {content}
      </li>
    );
  },
  onNotifyClick() {
    Actions.notify({
      active: false
    });
  }
});

const Nav = React.createClass({
  mixins: [State],
  render() {
    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand'>Carbuncle</Link>
          </div>
          <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
            <ul className='nav navbar-nav'>
              <li><Link to='/' activeClassName='active'>つくる</Link></li>
              <li><Link to='/scenario-list' activeClassName='active'>一覧</Link></li>
              <li><Link to='/setting' activeClassName='active'>設定</Link></li>
            </ul>
            <ul className='nav navbar-nav navbar-right'>
              <Notification />
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Nav;
