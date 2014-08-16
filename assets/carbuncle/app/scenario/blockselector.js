
goog.provide('app.scenario.BlockSelector');

goog.require('app.ui.Overlay');
goog.require('app.ui.SlickGrid');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.scenario.BlockSelector = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.setTitle('ブロックを選択してください');
};
goog.inherits(app.scenario.BlockSelector, app.ui.Overlay);

/** @inheritDoc */
app.ui.Overlay.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  function entriesFormatter(row, cell, value, column, raw) {
    return value.length;
  }

  var columns = [
    {id: "id", name: "ID", field: "id"},
    {id: "title", name: "Title", field: "title", width: 200},
    {id: "entries", name: "Number of Entries", field: "entries", formatter: entriesFormatter},
    {id: "createdAt", name: "createdAt", field: "createdAt", formatter: app.ui.SlickGrid.dateFormatter, width: 170},
    {id: "updatedAt", name: "updatedAt", field: "updatedAt", formatter: app.ui.SlickGrid.dateFormatter, width: 170}
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 41
  };

  var s = new app.ui.SlickGrid([], columns, options);
  s.render(this.getContentElement())
};
