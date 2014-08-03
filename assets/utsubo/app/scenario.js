
goog.provide('app.Scenario');

goog.require('app.soy.scenario');
goog.require('goog.soy');
goog.require('app.ui.Rows');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {app.ui.Rows}
 */
app.Scenario = function(opt_domHelper) {
  
  goog.base(this, app.soy.scenario.renderEntry,
      new app.ui.Rows.Data('id'), opt_domHelper);
};
goog.inherits(app.Scenario, app.ui.Rows);

/** @inheritDoc */
app.Scenario.prototype.createDom = function() {
  this.setElementInternal(
      /** @type {Element} */(goog.soy.renderAsFragment(app.soy.scenario.createDom)));
};

app.Scenario.prototype.getContentElement = function() {
  return this.getElementByClass('scenario-body');
};
