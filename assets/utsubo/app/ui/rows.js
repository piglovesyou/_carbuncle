
goog.provide('app.ui.Rows');

goog.require('goog.ui.Component');
goog.require('goog.soy');
goog.require('goog.object');



/**
 * @constructor
 * @param {Function} templateFn
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.ui.Rows = function(templateFn, opt_data, opt_domHelper) {
	goog.base(this, opt_domHelper);

	this.templateFn = templateFn;

	this.data = opt_data;
};
goog.inherits(app.ui.Rows, goog.ui.Component);

/**
 * @param {app.ui.Rows.Data} opt_data
 */
app.ui.Rows.prototype.setData = function(data) {
	this.data = data;
};

/** @inheritDoc */
app.ui.Rows.prototype.createDom = function() {
	goog.base(this, 'createDom');

	goog.dom.classes.add(this.getElement(), 'ui-rows');
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

	if (this.data && !this.data.isEmpty()) {
		this.redraw();
	}
};

app.ui.Rows.prototype.redraw = function() {
	var dh = this.getDomHelper();
	var fragment = dh.getDocument().createDocumentFragment();
	var contentEl = this.getContentElement();
	goog.dom.removeChildren(contentEl)
	goog.array.forEach(this.data.getAll(), function (item) {
		fragment.appendChild(
        goog.soy.renderAsFragment(this.templateFn, item));
	}, this);
	dh.append(contentEl, fragment);
};

/** @inheritDoc */
app.ui.Rows.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');
};





/**
 * @constructor
 * @extends goog.Disposable
 */
app.ui.Rows.Data = function(idProperty) {
	this.idProperty = idProperty;
	this.items = [];
	this.ids = {};
};
goog.inherits(app.ui.Rows.Data, goog.Disposable);

app.ui.Rows.Data.prototype.isEmpty = function() {
	return goog.array.isEmpty(this.items);
};

app.ui.Rows.Data.prototype.get = function(id) {
	return this.ids[id];
};

app.ui.Rows.Data.prototype.getAll = function() {
	return goog.array.clone(this.items);
};

app.ui.Rows.Data.prototype.insertAt = function(element, index) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
	if (existing) return;
	goog.array.insertAt(this.items, element, index);
	this.ids[id] = element;
};

app.ui.Rows.Data.prototype.add = function(element) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
	if (existing) return;
	this.items.push(element);
	this.ids[id] = element;
};

app.ui.Rows.Data.prototype.upsert = function(element) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
  if (existing) {
    goog.object.extend(existing, element);
  } else {
    this.add(element);
  }
};

app.ui.Rows.Data.prototype.remove = function(element) {
	var id = element[this.idProperty];
	var existing = this.ids[id];
	if (!existing) return;
	goog.array.remove(this.items, element)
	delete this.ids[id];
};

app.ui.Rows.Data.prototype.removeById = function(id) {
	this.remove(this.ids[id]);
};

app.ui.Rows.Data.prototype.clear = function(id) {
	this.items = [];
	this.ids = {};
};

