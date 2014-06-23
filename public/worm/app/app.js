
goog.provide('app.App');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 */
app.App = function() {
  var iframeEl = goog.dom.getElement('iframe');
  iframeEl;

};
goog.inherits(app.App, goog.events.EventTarget);

