
const React = require('react');

const Mask = React.createClass({

  render() {
    return (
      <div className='mask' onClick={this.props.onCancel}></div>
    );
  }

});

module.exports = Mask;
