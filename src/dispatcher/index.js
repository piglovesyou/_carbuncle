const {Dispatcher} = require('flux');

const instance = new Dispatcher();

module.exports = instance;
module.exports.dispatch = instance.dispatch.bind(instance);
