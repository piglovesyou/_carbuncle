
goog.provide('app.ui.Rows');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.ui.Rows = function(opt_domHelper) {
	goog.base(this, opt_domHelper);
};
goog.inherits(app.ui.Rows, goog.ui.Component);

/** @inheritDoc */
app.ui.Rows.prototype.createDom = function() {
	goog.base(this, 'createDom');
};

/** @inheritDoc */
app.ui.Rows.prototype.decorateInternal = function(element) {
	goog.base(this, 'decorateInternal', element);
};

/** @inheritDoc */
app.ui.Rows.prototype.canDecorate = function(element) {
	if (element) {
		return true;
	}
	return false;
};

/** @inheritDoc */
app.ui.Rows.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');
};

/** @inheritDoc */
app.ui.Rows.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
};



/**
 * @constructor
 * @extends goog.structs.Set
 */
app.ui.Rows.Data = function(idProperty) {
	goog.base(this);
	this.idProperty = idProperty;
	this.ids = {};
};
goog.inherits(app.ui.Rows.Data, goog.structs.Set);

app.ui.Rows.Data.prototype.add = function(element) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
	if (existing) return;
	goog.base(this, 'add', element);
	this.ids[id] = element;
};

app.ui.Rows.Data.prototype.remove = function(element) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
	if (!existing) return;
	goog.base(this, 'remove', element);
	delete this.ids[id];
};

app.ui.Rows.Data.prototype.clear = function(id) {
	goog.base(this, 'clear', element);
	this.ids = {};
};

