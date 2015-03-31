
var React = require('react');

var Pixel = React.createClass({

  getInitialState() {
    return {};
  },

  componentDidMount() {
  },

  render() {
    return (
      <div class="pixel">
        <div class="pixel-border pixel-border-top"></div>
        <div class="pixel-border pixel-border-right"></div>
        <div class="pixel-border pixel-border-bottom"></div>
        <div class="pixel-border pixel-border-left"></div>
      </div>
    );
  }

});

module.exports = Pixel;
