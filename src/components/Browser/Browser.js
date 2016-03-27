const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const {DRIVER_TARGET_ID} = require('../../const');

class Browser extends React.Component {
  render() {
    return (
      <div className="browser">
        <div className="browser__header">
          <div className="row">
            <div className="col-lg-6">
              <div className="input-group input-group-lg">
                <span className="input-group-btn">
                  <button className="btn btn-default"
                      title="history.back()"
                      onClick={this.props.onHistoryBackClick}
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <button className="btn btn-default"
                      title="location.reload()"
                      onClick={this.props.onLocationReloadClick}
                  >
                    <i className="fa fa-refresh"></i>
                  </button>
                </span>
                <form className=""
                    onSubmit={this.props.onLocationTextSubmit}
                >
                  <input type="text"
                      ref="locationInput"
                      className="input-lg form-control"
                      placeholder="Target url"
                      onChange={this.props.onLocationTextChange}
                      defaultValue="http://www.google.com/ncr"
                  />
                </form>
                <span className="input-group-btn">
                  <button className={'btn btn-default browser__rec-btn' + (this.props.isRecording ? ' browser__rec-btn--active' : '')}
                      title={this.props.isRecording ? 'Stop recording' : 'Start recording'}
                      onClick={this.props.onRecordButtonClick}
                  >
                    <i className="fa fa-circle"></i>
                  </button>
                  <button className={'btn btn-default' + (this.props.isRecording ? ' disabled' : '')}
                      onClick={!this.props.isRecording ? () => hashHistory.push('/dashboard') : null}
                  >
                    <i className="fa fa-bars"></i>
                  </button>
                  <button className={'btn btn-default' + (this.props.isRecording ? ' disabled' : '')}
                      onClick={!this.props.isRecording ? () => hashHistory.push('/dashboard/setting') : null}>
                    <i className="fa fa-cog"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <iframe id={DRIVER_TARGET_ID}
          ref="iframe"
          src={this.props.location}
          onLoad={this.props.onIFrameLoaded}
          className="browser__iframe"
        />
      </div>
    );
  }
  get iFrameEl() {
    return this.refs.iframe;
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.refs.iframe.contentWindow.location &&
        this.props.location !== this.refs.iframe.contentWindow.location.href;
  }
  get locationInputEl() {
    return this.refs.locationInput;
  }

}

module.exports = Browser;

