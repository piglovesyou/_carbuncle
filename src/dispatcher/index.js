const {Dispatcher} = require('flux');

const instance = new Dispatcher();

module.exports = instance;
module.exports.dispatch = instance.dispatch.bind(instance);
module.exports.dispatchChange = (data) => instance.dispatch({ type: 'change', data });
