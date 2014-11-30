
/**
 * @deprecated Not any more
 */
goog.provide('app.socket');

goog.require('goog.Promise');
goog.require('goog.Timer');
goog.require('goog.ui.Component');



/**
 * @private
 * @constructor
 * @extends {goog.events.EventTarget}
 */
app.Socket_ = function() {
  goog.base(this);

  /**
   * @type {goog.Promise}
   */
  this.promise;

  this.promiseConnect();
};
goog.inherits(app.Socket_, goog.events.EventTarget);
goog.addSingletonGetter(app.Socket_);

app.Socket_.prototype.promiseConnect = function() {
  var that = this;
  this.promise = new goog.Promise(function(resolver, rejector) {
    var socket = io.connect();
    socket.on('connect', function() {
      resolver(socket);
    });
    // socket.on('disconnect', function() {
    // });
  }, this);
};

/** @inheritDoc */
app.Socket_.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};



/**
 * @return {goog.Promise} .
 */
app.socket = function() {
  return app.Socket_.getInstance().promise;
};
