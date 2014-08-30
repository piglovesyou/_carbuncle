
goog.provide('app.scenario.BlockSelector');

goog.require('app.ui.Overlay');
goog.require('app.ui.ScenarioGrid');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {app.ui.Overlay}
 */
app.scenario.BlockSelector = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.setTitle('ブロックを選択してください');

  this.scenarioGrid = new app.ui.ScenarioGrid([]);
  this.addChild(this.scenarioGrid);
};
goog.inherits(app.scenario.BlockSelector, app.ui.Overlay);

var s;

/** @inheritDoc */
app.scenario.BlockSelector.prototype.enterDocument = function() {
  this.scenarioGrid.render(this.getContentElement());

  goog.base(this, 'enterDocument');
};
