
goog.provide('app.ui.ScenarioGrid');
goog.require('app.ui.SlickGrid');


/**
 * @constructor
 * @extends {app.ui.SlickGrid}
 *
 * @param {Object=} opt_data .
 * @param {Array=} opt_columns .
 * @param {Object=} opt_options .
 * @param {goog.dom.DomHelper=} opt_domHelper .
 */
app.ui.ScenarioGrid = function(opt_data, opt_columns, opt_options, opt_domHelper) {

  var columns = [
    {id: 'id', name: 'ID', field: 'id'},
    {id: 'title', name: 'Title', field: 'title', width: 200},
    {id: 'entries', name: 'Number of Entries', field: 'entries', formatter: entriesFormatter},
    {id: 'createdAt', name: 'createdAt', field: 'createdAt', formatter: app.ui.SlickGrid.dateFormatter, width: 170},
    {id: 'updatedAt', name: 'updatedAt', field: 'updatedAt', formatter: app.ui.SlickGrid.dateFormatter, width: 170}
  ];
  if (opt_columns) {
    columns = columns.concat(opt_columns);
  }

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 41
  };
  if (opt_options) {
    goog.mixin(options, opt_options);
  }

  goog.base(this, opt_data, columns, options, opt_domHelper);

  function entriesFormatter(row, cell, value, column, raw) {
    return value.length;
  }

};
goog.inherits(app.ui.ScenarioGrid, app.ui.SlickGrid);

/** @type {string} */
app.ui.ScenarioGrid.SELECT = 'slct';

/** @inheritDoc */
app.ui.ScenarioGrid.prototype.enterDocument = function() {
  goog.dom.classlist.add(this.getElement(), 'scenariogrid');
  goog.base(this, 'enterDocument');

  var that = this;

  this.slickgrid.onClick.subscribe(function(e, data) {
    var row = this.getDataItem(data['row']);
    if (row) {
      that.dispatchEvent({
        type: app.ui.ScenarioGrid.SELECT,
        data: row
      });
    }
  });

  // TODO
  //
  // app.socket().then(function(socket) {
  //   socket.get('/carbuncle/scenario', function(res) {
  //     that.slickgrid.setData(res);
  //     that.slickgrid.render();
  //   });
  // });

};
