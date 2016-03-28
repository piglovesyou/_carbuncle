/* Mostly from https://hacks.mozilla.org/2015/08/es6-in-depth-subclassing/ . Thanks Mozilla. */

const NOT_TO_COPY_PROPERTIES = {
  constructor: true,
  prototype: true,
  name: true
};

module.exports = mix;

/**
 * Mixing from right. First argument is the strongest.
 */
function mix(...Klasses) {
  class Mixed {}
  for (let i = 0, Klass = Klasses[i]; i < Klasses.length; Klass = Klasses[++i]) {
    copyProperties(Mixed, Klass);
    copyProperties(Mixed.prototype, Klass.prototype);
  }
  return Mixed;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (NOT_TO_COPY_PROPERTIES[key]) continue;
    let desc = Object.getOwnPropertyDescriptor(source, key);
    Object.defineProperty(target, key, desc);
  }
}
