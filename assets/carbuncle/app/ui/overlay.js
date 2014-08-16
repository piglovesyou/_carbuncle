
goog.provide('app.ui.Overlay');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Overlay = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.render();
};
goog.inherits(app.Overlay, goog.ui.Component);

/**
 * @enum {string}
 */
app.Overlay.EventType = {
  CANCEL: 'cancel'
};

/**
 * @param {boolean} show .
 */
app.Overlay.prototype.show = function(show) {
  var eh = this.getHandler();
  if (show) {
    eh.listen(this.getElement(), 'click', this.handleClick);
  } else {
    eh.unlisten(this.getElement(), 'click', this.handleClick);
  }
  goog.dom.classlist.enable(this.getElement(), 'open', show);
};

/**
 * @param {goog.events.Event} e .
 */
app.Overlay.prototype.handleClick = function(e) {
  if (e.target == this.getElement()) {
    this.dispatchEvent(app.Overlay.EventType.CANCEL);
  }
};

/** @inheritDoc */
app.Overlay.prototype.createDom = function() {
  var dh = this.getDomHelper();
  this.setElementInternal(dh.createDom('div', 'overlay overlay-scale'));
};

