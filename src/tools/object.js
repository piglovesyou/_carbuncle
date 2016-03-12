const _ = require('underscore');

module.exports = {
  deepClone
};

function deepClone(obj) {
  if (_.isDate(obj)) {
    return _.clone(obj);
  } else if (_.isArray(obj)) {
    return _.map(obj, deepClone);
  } else if (_.isObject(obj)) {
    const dest = {};
    _.each(obj, (v, k) => (dest[k] = deepClone(v)));
    return dest;
  }
  return obj;
}
