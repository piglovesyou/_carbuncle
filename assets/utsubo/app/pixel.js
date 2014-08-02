
goog.provide('app.Pixel');

goog.require('goog.ui.Component');
goog.require('goog.soy');
goog.require('app.soy.pixel');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Pixel = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.Pixel, goog.ui.Component);
goog.addSingletonGetter(app.Pixel);

app.Pixel.init = function(parentEl) {
  var p = app.Pixel.getInstance();
  goog.asserts.assert(!p.isInDocument());
  p.render(parentEl);
};

app.Pixel.prototype.setShown = function(show) {
  goog.style.setElementShown(this.getElement(), show);
};

app.Pixel.prototype.reposition = function(rect) {
  this.setShown(true);
  goog.style.setPosition(pixelEl, rect.getTopLeft());

  goog.style.setWidth(this.top, rect.width);
  goog.style.setWidth(this.bottom, rect.width);
  goog.style.setHeight(this.left, rect.height);
  goog.style.setHeight(this.right, rect.height);

  goog.style.setPosition(this.right, rect.width, 0);
  goog.style.setPosition(this.bottom, 0, rect.height);
};

/** @inheritDoc */
app.Pixel.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsFragment(app.soy.pixel.createDom));
  this.top = this.getElementByClass('worm-pixel-border-top');
  this.right = this.getElementByClass('worm-pixel-border-right');
  this.bottom = this.getElementByClass('worm-pixel-border-bottom');
  this.left = this.getElementByClass('worm-pixel-border-left');
};

/** @inheritDoc */
app.Pixel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
