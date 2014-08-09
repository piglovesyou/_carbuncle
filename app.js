
global.goog = require('closure').Closure({ CLOSURE_BASE_PATH: 'libs/closure-library/closure/goog/' });
goog.require('goog.string');

global.Q = require('q');
global._ = require('underscore');

var Options = require('./helpers').Options;
global.options = new Options({ site: 'http://yan-yan-yahuoku.com/' })

// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);

