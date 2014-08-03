
goog.provide('app.Scenario');

goog.require('app.soy.scenario');
goog.require('goog.soy');
goog.require('goog.dom.dataset');
goog.require('app.dom');
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

app.Scenario.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var eh = this.getHandler();
  eh.listen(this.getElement(), 'click', function (e) {
    var et = /** @type {Element} */(e.target);

    var entryEl = app.dom.getAncestorFromEventTargetByClass(this.getElement(), 'scenario-entry', et);
    if (entryEl) {
      var entry = this.data.get(goog.dom.dataset.get(entryEl, 'id'));
      if (entry) {
        console.log(entry);
      }
      return;
    }

    if (goog.dom.classes.has(et, 'scenario-footer-reset')) {
      this.data.clear();
      this.draw();
    } else if (goog.dom.classes.has(et, 'scenario-footer-save')) {
    } else if (goog.dom.classes.has(et, 'scenario-footer-preview')) {
    }
  })
}

/** @inheritDoc */
app.Scenario.prototype.createDom = function() {
  this.setElementInternal(
      /** @type {Element} */(goog.soy.renderAsFragment(app.soy.scenario.createDom)));
};

app.Scenario.prototype.getContentElement = function() {
  return this.getElementByClass('scenario-body');
};
