/**
 * ScenarioController
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

var common = require('./common');

module.exports = {

  upsert: function (req, res) {
    var json = req.body;
    if (json && _.isObject(json)) {
      Scenario.upsertOne(json).then(function(doc) {
        res.json(doc);
      }).catch(common.promiseHandleError(res));
    } else {
      res.json({error: 1});
    }
  },


  drop: function (req, res) {
    Scenario.destroy().then(function() {
      res.json({success: 1})
    }).catch(function() {
      res.json({error: 1})
    })
  },
  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ScenarioController)
   */
  _config: {}

  
};

