const React = require('react');
const { Router, Route, IndexRoute, Link, IndexLink, hashHistory } = require('react-router');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Draggable = require('react-draggable');

const ReactDOM = require('react-dom');

class StepAdder extends React.Component {
  render() {
    return (
      <div className="step-adder">
        <button className="step-adder__verify btn btn-default"
            onClick={this.props.onAddVerifyingStepClick}
            title="Add verifying step"
        >
          <i className="fa fa-plus"></i>
          &nbsp;Verify
        </button>
      </div>
    );
  }
}

class Step extends React.Component {
  render() {
    return (
      <div className="step">
        <div className="step__buttons">
          {this.props.onStepRemoveClicked
            ?  <button className="btn btn-sm btn-default"
                onClick={this.props.onStepRemoveClicked}
                title="Remove this step"
            >
              <i className="fa fa-trash"></i>
            </button>
            : null}
        </div>
        <div className="step__content">

          <div className="step__name">
            {this.props.type.name}
          </div>
          <div className="step__value">
            {this.renderValue()}
          </div>

        </div>
      </div>
    );
  }

  renderValue() {
    if (this.props.url) {
      return this.props.url;
    }
    if (this.props.text) {
      if (/^\n$/.test(this.props.text)) {
        return 'Enter';
      }
      return this.props.text;
    }
    if (this.props.locator) {
      return `${this.props.locator.getName()}: ${this.props.locator.getValue()}` 
    }
    return null;
  }
};

class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Draggable
        handle=".palette__handle"
        start={{x: 512, y: 128}}
        bounds="parent"
        ref="draggable"
      >
        <div className="palette" ref="elm">
          <div className="palette__header">
            <button className="btn btn-default btn-lg" onClick={this.props.onPlaybackClick}><i className="fa fa-fw fa-play"></i></button>
            <span className="palette__handle flex-spacer">
            </span>
            <button className="btn btn-default btn-lg"><i className="fa fa-fw fa-cog"></i></button>
          </div>
          <div className="palette__body">
            {this.props.testCase.map(step => {
              return <Step key={step.id}
                  onStepRemoveClicked={onStepRemoveClicked.bind(this, step)}
                  {...step} />
            })}
            <StepAdder {...this.props} />
          </div>
          <div className="palette__footer">
            <button className="btn btn-default btn-lg"><i className="fa fa-fw fa-cog"></i></button>
            <span className="flex-spacer"></span>
            <button className="btn btn-default btn-lg"><i className="fa fa-fw fa-cog"></i></button>
          </div>
        </div>
      </Draggable>
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.testCase.length < this.props.testCase.length) {
      // TODO: How I can force update draggable positioning
    }
  }
  onDragStop(e) {
    console.log(e.x, e.y);
  }
}

module.exports = Palette;

function onStepRemoveClicked(step) {
  const index = this.props.testCase.findIndex(s => s.id === step.id);
  if (index < 0) return;
  this.setState({
    testCase: this.props.testCase.splice(index, 1)
  });
}
