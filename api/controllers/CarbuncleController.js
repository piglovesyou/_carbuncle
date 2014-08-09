/**
 * CarbuncleController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Executor = require('../services/carbuncle').Executor;

module.exports = {
    
  call: function(req, res) {
    var scenario = req.body;
    var delay = req.param('delay') || 0;
    var entries = scenario.entries;
    if (_.isArray(entries) && !_.isEmpty(entries)) {
      var executor = new Executor(entries, delay);
      var error;
      executor.on('before', function(entry) {
        req.socket.emit('before', {
          scenario: scenario,
          entry: entry
        });
      });
      executor.on('pass', function() {
        req.socket.emit('pass', {
          scenario: scenario
        });
      });
      executor.on('fail', function(e) {
        error = e;
        req.socket.emit('fail', {
          scenario: scenario,
          error: e,
          stack: e.stack
        });
      });
      executor.on('end', function() {
        if (error) {
          res.json({error: error, stack: error.stack})
        } else {
          res.json({success: true});
        }
      });
    } else {
      res.json({error: 'boom'});
    }
  },

  index: function (req, res) {
    console.log(global.options);
    res.view('home/index', {
      site: global.options.site
    });
  },

  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CarbuncleController)
   */
  _config: {}

  
};
