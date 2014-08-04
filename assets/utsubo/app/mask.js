
goog.provide('app.Mask');
goog.provide('app.mask');

goog.require('goog.ui.Component');




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

app.Mask.prototype.focus = function(el) {
  goog.style.setStyle((this.focusedEl = el), 'z-index', 11);
  goog.style.setElementShown(this.getElement(), true);
};

app.Mask.prototype.hide = function() {
  goog.style.setStyle(this.focusedEl, 'z-index', '');
  goog.style.setElementShown(this.getElement(), false);
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
