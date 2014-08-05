
goog.provide('app.Socket');

goog.require('goog.ui.Component');
goog.require('goog.Promise');



/**
 * @private
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.events.EventTarget}
 */
app.Socket = function() {
  goog.base(this);

  /**
   * @type {goog.Promise}
   */
  this.promise;

  this.promiseConnect();
};
goog.inherits(app.Socket, goog.events.EventTarget);
goog.addSingletonGetter(app.Socket);

app.Socket.prototype.promiseConnect = function() {
  var that = this;
  this.promise = new goog.Promise(function(resolver, rejector) {
    var socket = goog.global.io.connect();
    socket.on('connect', function () {
      resolver(socket);
    })
    socket.on('disconnect', function () {
      that.promiseConnect(); // Persistently connecting
    })
  }, this);
};

/** @inheritDoc */
app.Socket.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};



/**
 * @return {goog.Promise} .
 */
app.socket = function() {
  return app.Socket.getInstance().promise;
};
