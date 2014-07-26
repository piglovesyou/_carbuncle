
goog.provide('app.Site');

goog.require('goog.ui.Component');
goog.require('app.soy.site');
goog.require('goog.soy');




/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Site = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.Site, goog.ui.Component);

/** @inheritDoc */
app.Site.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsFragment(app.soy.site.createDom));
};

// /** @inheritDoc */
// app.Site.prototype.decorateInternal = function(element) {
//   goog.base(this, 'decorateInternal', element);
// };
// 
// /** @inheritDoc */
// app.Site.prototype.canDecorate = function(element) {
//   if (element) {
//     return true;
//   }
//   return false;
// };

/** @inheritDoc */
app.Site.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};

/** @inheritDoc */
app.Site.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
