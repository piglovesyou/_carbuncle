
goog.provide('app.Editor');

goog.require('goog.ui.Component');
goog.require('app.soy.editor');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.Editor = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.Editor, goog.ui.Component);

/** @inheritDoc */
app.Editor.prototype.createDom = function() {
  this.setElementInternal(
      goog.soy.renderAsFragment(app.soy.editor.createDom));
};

app.Editor.prototype.setData = function(data) {
  goog.soy.renderElement(this.getElement(),
      app.soy.editor.renderContent, data);
};

/** @inheritDoc */
app.Editor.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var eh = this.getHandler();

  eh.listen(this.getElement(), 'change', function (e) {
    var selectEl = e.target;
    goog.asserts.assert(selectEl.tagName == goog.dom.TagName.SELECT);
    if (goog.dom.classes.has(selectEl, 'mode-select')) {
      this.toggleModeSelectorDependers();
    }
  });

  eh.listen(this.getElement(), 'click', function (e) {
    var el = e.target;
    if (goog.dom.contains(this.getElementByClass('selector-button-a'), el)) {
      this.dispatchEvent('enter-select-mode');

    } else if (goog.dom.contains(this.getElementByClass('append-button'), el)) {
      this.dispatchEvent('append-entry');
    }
  });

  this.enableSelectorInputHandler(true);

  this.toggleModeSelectorDependers();
};

app.Editor.prototype.enableSelectorInputHandler = function(enable) {
  var eh = this.getHandler();
  if (enable) {
    if (this.selectorInputHandler_) return;
    this.selectorInputHandler_ = new goog.events.InputHandler(this.getElementByClass('selector-textarea'));
    eh.listen(this.selectorInputHandler_, goog.events.InputHandler.EventType.INPUT, this.handleSelectorTextKey);
  } else {
    if (!this.selectorInputHandler_) return;
    eh.unlisten(this.selectorInputHandler_, goog.events.InputHandler.EventType.INPUT, this.handleSelectorTextKey);
    this.selectorInputHandler_.dispose();
    this.selectorInputHandler_ = null;
  }
};

app.Editor.prototype.handleSelectorTextKey = function (e) {
  this.dispatchEvent('selector-text-input');
};

/***/
app.Editor.prototype.toggleModeSelectorDependers = function() {
  switch (goog.dom.forms.getValue(this.getElementByClass('mode-select'))) {
    case 'action':
      goog.style.setElementShown(this.getElementByClass('action-select'), true);
      goog.style.setElementShown(this.getElementByClass('verify-select'), false);
      break;
    case 'verify':
      goog.style.setElementShown(this.getElementByClass('action-select'), false);
      goog.style.setElementShown(this.getElementByClass('verify-select'), true);
      break;
  }
};

/** @inheritDoc */
app.Editor.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
