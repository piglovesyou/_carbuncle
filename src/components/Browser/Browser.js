const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const Recorder = require('../../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/recorder');
const {DRIVER_TARGET_ID} = require('../../const');

global.carbuncleTargetWindow = null;
let iframeEl;
let recorder;

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false
    }
  }
  render() {
    return (
      <div className="browser">
        <div className="browser__header">
          <div className="row">
            <div className="col-lg-6">
              <div className="input-group input-group-lg">
                <span className="input-group-btn">
                  <button className="btn btn-default" title="history.back()">
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <button className="btn btn-default" title="location.reload()">
                    <i className="fa fa-refresh"></i>
                  </button>
                </span>
                <input type="text" className="form-control" placeholder="Target url" />
                <span className="input-group-btn">
                  <button className="btn btn-default browser__rec-btn" title={this.state.isRecording ? 'Stop recording' : 'Start recording'}>
                    <i className="fa fa-circle"></i>
                  </button>
                  <button className="btn btn-default" onClick={() => hashHistory.push('/dashboard')}>
                    <i className="fa fa-bars"></i>
                  </button>
                  <button className="btn btn-default" onClick={() => hashHistory.push('/dashboard/setting')}>
                    <i className="fa fa-cog"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <iframe id={DRIVER_TARGET_ID}
            ref={el => iframeEl = el}
            onLoad={onIFrameLoaded}
            className="browser__iframe"
            src={this.props.location} />
      </div>
    );
  }

  onLocationTextChange(e) {
  }
}

module.exports = Browser;

function onIFrameLoaded(e) {
  global.carbuncleTargetWindow = iframeEl.contentWindow;
  recorder = new Recorder(iframeEl.contentWindow, (step) => {
    // TODO: Use it.
    console.log(step);
  }, () => {
    return null; // TODO: Return last step
  })
}

function startRecording() {
  var document = iframeEl.contentWindow.document;
}
