
goog.provide('app.App');

goog.require('app.Editor');
goog.require('app.Scenario');
goog.require('app.Site');
goog.require('app.mask');
goog.require('app.Socket');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events.EventTarget');
goog.require('goog.events.InputHandler');
goog.require('goog.net.IframeLoadMonitor');
goog.require('goog.structs.Set');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends goog.ui.Component
 */
app.App = function() {
  goog.base(this);

  this.editor = new app.Editor;
  this.addChild(this.editor);

  this.site = new app.Site;
  this.addChild(this.site);

  this.scenario = new app.Scenario;
  this.addChild(this.scenario);
};
goog.inherits(app.App, goog.ui.Component);

/** @inheritDoc */
app.App.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.editor.createDom();
  this.site.createDom();
  this.scenario.createDom();

  var dh = this.getDomHelper();
  dh.append(/** @type {!Node} */(element),
    this.editor.getElement(),
    dh.createDom('div', 'main',
      this.site.getElement(),
      this.scenario.getElement()));
};

/** @inheritDoc */
app.App.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var eh = this.getHandler();
  eh.listen(this, 'enter-select-mode', this.handleEnterSelectMode);
  eh.listen(this, 'selector-text-input', this.handleSelectorTextKey);
  eh.listen(this, 'elementselect', this.handleElementSelect);
  eh.listen(this, 'append-entry', this.handleAppendEntry);
  eh.listen(this, 'editentry', this.handleEditEntry);

  app.socket().then(function(socket) {
    socket.get('/utsubo/set', function (res) {
      console.log(res);
    })
  })
};

/**
 * @param {goog.events.Event} e .
 */
app.App.prototype.handleEditEntry = function(e) {
  var data = {};
  goog.object.extend(data, e.data, {
    isEdit: true
  });
  this.editor.draw(data);
};

/**
 * @param {goog.events.Event} e .
 */
app.App.prototype.handleSelectorTextKey = function(e) {
  var text = e.text;
  try {
    var el = this.site.getDocument().querySelector(text);
    if (el) {
      this.site.redrawPixel(el);
      this.site.pixel.show(true);
      return;
    }
  } catch (e) {}
  this.site.pixel.show(false);
};

/**
 * @param {goog.events.Event} e .
 */
app.App.prototype.handleAppendEntry = function(e) {
  this.scenario.data.upsert(e.data);
  this.scenario.redraw();
};

/**
 * @param {goog.events.Event} e .
 */
app.App.prototype.handleElementSelect = function(e) {
  this.enableSelectMode(false);
  this.editor.setSelectorText(e.selectorText);
  this.editor.setRoughTitle(e.roughTitle);
};

/**
 * @param {goog.events.Event} e .
 */
app.App.prototype.handleEnterSelectMode = function(e) {
  this.enableSelectMode(true);
};

/**
 * @param {boolean} enable .
 */
app.App.prototype.enableSelectMode = function(enable) {
  // goog.style.setElementShown(this.getElementByClass('Mask'), enable);
  var eh = this.getHandler();
  if (enable) {
    app.mask.focus(this.site.getElement());
    this.editor.enable(false);
    this.site.enable(true);
  } else {
    app.mask.hide();
    this.editor.enable(true);
    this.site.enable(false);
  }
};

