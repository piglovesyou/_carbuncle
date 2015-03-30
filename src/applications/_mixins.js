
var Store = require('../stores');

module.exports = {

  componentDidMount() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
  },

  getInitialState() {
    return this.createState();
  },

  _onChange() {
    this.setState(this.createState());
  }

};
