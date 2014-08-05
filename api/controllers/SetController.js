/**
 * SetController
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

var Executor = require('../services/webdriver').Executor;

module.exports = {
    


  preview: function (req, res) {
    var json = req.body;
    var entries = json.entries;
    if (_.isArray(entries) && !_.isEmpty(entries)) {
      console.log('#######');
      var executor = new Executor(entries, 800);
      var error;
      executor.on('before', function(entry) { console.log('before ' + entry.title + ' ...') });
      executor.on('pass', function() {
        console.log(arguments);
      });
      executor.on('error', function(e) {
        error = e;
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
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SetController)
   */
  _config: {}

  
};
