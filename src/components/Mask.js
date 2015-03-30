
var React = require('react');

var Mask = React.createClass({

  render() {
    return (
      <div className="mask" onClick={this.props.onCancel}></div>
    );
  }

});

module.exports = Mask;
