
const React = require('react');

const Pixel = React.createClass({

  render() {
    return (
      <div className='pixel' style={{
        top: this.props.y,
        left: this.props.x
      }} title={this.props.description}>
        <div className='pixel__border pixel__border-top' style={{
          width: this.props.width
        }}></div>
        <div className='pixel__border pixel__border-right' style={{
          left: this.props.width,
          height: this.props.height
        }}></div>
        <div className='pixel__border pixel__border-bottom'style={{
          width: this.props.width,
          top: this.props.height
        }}></div>
        <div className='pixel__border pixel__border-left' style={{
          height: this.props.height
        }}></div>
      </div>
    );
  }

});

module.exports = Pixel;
