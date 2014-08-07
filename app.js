
global.goog = require('closure').Closure({ CLOSURE_BASE_PATH: 'libs/closure-library/closure/goog/' });
goog.require('goog.string');

global.Q = require('q');

var Url = require('url');

global.options = new Options({
  site: 'http://yan-yan-yahuoku.com/'
})

global._ = require('underscore');

// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);




function Options(obj) {
  var u = Url.parse(obj.site);
  Object.defineProperty(this, 'site', { value: u.protocol + '//' + u.hostname });
  Object.seal(this);
}
