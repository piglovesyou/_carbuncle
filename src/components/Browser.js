const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, browserHistory } = require('react-router');

class Browser extends React.Component {
  render() {
    return (
      <div className="browser">
        <div className="browser__header">
          <div className="row">
            <div className="col-lg-6">
              <div className="input-group input-group-lg">
                <span className="input-group-btn">
                  <button className="btn btn-default">
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <button className="btn btn-default">
                    <i className="fa fa-refresh"></i>
                  </button>
                </span>
                <input type="text" className="form-control" placeholder="Target url" />
                <span className="input-group-btn">
                  <button className="btn btn-primary" onClick={this.props.onMenuButtonClick}>
                    <i className="fa fa-bars"></i>
                  </button>
                  <button className="btn btn-default browser__rec-btn">
                    <i className="fa fa-circle"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <iframe className="browser__iframe" src={this.props.location} ref="iframe"></iframe>
      </div>
    );
  }

  onLocationTextChange(e) {
  }
}

module.exports = Browser;
