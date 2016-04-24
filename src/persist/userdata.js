const PREFIX = 'carbuncle:';

module.exports = {put, get};

function put(key, value) {
  global.localStorage.setItem(PREFIX + key, value);
}

function get(key) {
  return global.localStorage.getItem(PREFIX + key);
}
