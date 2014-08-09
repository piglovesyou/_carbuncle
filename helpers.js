
var Url = require('url');

module.exports.Options = Options;

function Options(obj) {
  var u = Url.parse(obj.site);
  Object.defineProperty(this, 'site', { value: u.protocol + '//' + u.hostname });
  Object.seal(this);
}

