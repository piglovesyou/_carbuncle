/**
 * Scenario
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = _.extend({

  upsertOne: function(doc) {
    var that = this;
    if (doc.id == null) {
      // XXX: Report empty string id issue
      return that.create(doc).toPromise();
    }
    return that.findOne(doc.id).then(function(found) {
      return found ?
        global.Scenario.update(doc.id, doc).toPromise().get(0) :
        that.create(doc).toPromise();
    });
  },

  upsert: function(doc) {
    var that = this;
    if (doc.id == null) {
      return create(doc);
    }
    return that.findOne(doc.id).then(function(found) {
      return found ?
        that.update(doc.id, doc).toPromise() :
        create(doc);
    });
    function create(doc) {
      return that.create(doc).then(function(doc) {
        return [doc];
      });
    }
  },

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  }

});
