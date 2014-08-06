
goog.provide('app.Mask');
goog.provide('app.mask');

goog.require('goog.ui.Component');




app.mask.get = function () {
  return app.Mask.getInstance();
};

app.mask.focus = function (paneEl) {
  app.Mask.getInstance().focus(paneEl);
};

app.mask.hide = function () {
  app.Mask.getInstance().hide();
};



/**
 * @private
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Mask = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  /**
   * @type {Element}
   */
  this.focusedEl;

  this.render();
};
goog.inherits(app.Mask, goog.ui.Component);
goog.addSingletonGetter(app.Mask);

/**
 * @enum {string}
 */
app.Mask.EventType = {
  CANCEL: 'cancel'
};

app.Mask.prototype.focus = function(el) {
  goog.style.setStyle((this.focusedEl = el), 'z-index', 11);
  goog.style.setElementShown(this.getElement(), true);
};

app.Mask.prototype.hide = function() {
  goog.style.setStyle(this.focusedEl, 'z-index', '');
  goog.style.setElementShown(this.getElement(), false);
};

app.Mask.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var eh = this.getHandler();
  eh.listen(this.getElement(), goog.events.EventType.CLICK, function (e) {
    this.dispatchEvent(app.Mask.EventType.CANCEL);
  });
};

/** @inheritDoc */
app.Mask.prototype.createDom = function() {
  var dh = this.getDomHelper();
  this.setElementInternal(dh.createDom('div', {
    className: 'mask',
    style: 'display:none'
  }))
};

/** @inheritDoc */
app.Mask.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
