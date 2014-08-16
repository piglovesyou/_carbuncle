
goog.provide('app.ui.SlickGrid');

goog.require('goog.date.Date');
goog.require('goog.date.DateTime');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimePatterns');
goog.require('goog.i18n.DateTimePatterns_ja');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeSymbols_ja');
goog.require('goog.i18n.TimeZone');

goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ja;
goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ja;

goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.ui.SlickGrid = function(opt_data, opt_columns, opt_options, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.data = opt_data;
  this.columns = opt_columns;
  this.options = opt_options;

  /**
   * @type {Slick.Grid}
   */
  this.slickgrid;
};
goog.inherits(app.ui.SlickGrid, goog.ui.Component);

/** @inheritDoc */
app.ui.SlickGrid.prototype.enterDocument = function() {
  this.slickgrid = new Slick.Grid(this.getElement(),
      this.data, this.columns, this.options);
  goog.base(this, 'enterDocument');
};

/** @inheritDoc */
app.ui.SlickGrid.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};

app.ui.SlickGrid.dateFormatter = function (row, cell, value, column, raw) {
  var fmt = app.ui.SlickGrid.dateFormatter.fmt_ || 
    (app.ui.SlickGrid.dateFormatter.fmt_ = new goog.i18n.DateTimeFormat(
        goog.i18n.DateTimePatterns.WEEKDAY_MONTH_DAY_YEAR_MEDIUM));
  return fmt.format(new Date(value));
};

/**
 * @private
 * @type {goog.i18n.DateTimeFormat}
 */
app.ui.SlickGrid.dateFormatter.fmt_;
