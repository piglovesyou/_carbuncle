
goog.provide('app.dao');
goog.provide('app.dao.scenario');
goog.provide('app.dao.preference');

goog.require('goog.Promise');







app.dao = {};

app.dao.preference = function() {
  return app.dao.promise_('preference');
};

app.dao.scenario = function() {
  return app.dao.promise_('scenario');
};

app.dao.promise_ = function(dbName) {
  var path = require('path');
  var Nedb = require('nedb');
  var dataPath = require('nw.gui').App.dataPath;
  var dbFileName = dbName + '.db';
  var privateNamespace = dbName + '_';
  var optionBase = {};
  return app.dao[privateNamespace] || (app.dao[privateNamespace] =
      new goog.Promise(function(resolver, rejector) {
        var db = new Nedb({
          filename: path.join(dataPath, dbFileName),
          __proto__: optionBase
        });
        db.loadDatabase(function(err) {
          if (err) {
            rejector(err);
            return;
          }
          resolver(db);
        });
      }));
};

