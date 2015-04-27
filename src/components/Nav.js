var React = require('react');
var {Link, State} = require('react-router');

var Nav = React.createClass({
  mixins: [State],
  render() {
    var currentPathName = this.getPathname();
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Carbuncle</Link>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={currentPathName === '/' ? 'active' : ''}><Link to="/">つくる</Link></li>
              <li className={currentPathName === '/scenario-list' ? 'active' : ''}><Link to="/scenario-list">一覧</Link></li>
              <li className={currentPathName === '/setting' ? 'active' : ''}><Link to="/setting">設定</Link></li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle">user1 <span className="caret"></span></a>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li className="divider"></li>
                  <li><a href="#">Separated link</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Nav;
