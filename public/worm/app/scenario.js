
goog.provide('app.Scenario');

goog.require('app.soy.scenario');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Scenario = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.Scenario, goog.ui.Component);

app.Scenario.prototype.append = function(obj) {
  var entry = new app.Scenario.Entry;
  this.addChild(entry, true);
  entry.renderContent(obj);
};

/** @inheritDoc */
app.Scenario.prototype.createDom = function() {
  goog.base(this, 'createDom');
};

/** @inheritDoc */
app.Scenario.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.titleEl = this.getElementByClass('scenario-header');
  this.contentEl = this.getElementByClass('scenario-body');
  this.footerEl = this.getElementByClass('scenario-footer');

};

/** @inheritDoc */
app.Scenario.prototype.getContentElement = function() {
  return this.contentEl;
};

/** @inheritDoc */
app.Scenario.prototype.canDecorate = function(element) {
  if (element) {
    return true;
  }
  return false;
};

/** @inheritDoc */
app.Scenario.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};

/** @inheritDoc */
app.Scenario.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};





/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Scenario.Entry = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.Scenario.Entry, goog.ui.Component);

/** @inheritDoc */
app.Scenario.Entry.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classes.add(this.getElement(),
      'scenario-entry');
};

app.Scenario.Entry.prototype.renderContent = function(data) {

  goog.soy.renderElement(this.getElement(),
      app.soy.scenario.renderEntryContent, data);

};

/** @inheritDoc */
app.Scenario.Entry.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};

/** @inheritDoc */
app.Scenario.Entry.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
