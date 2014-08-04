
goog.provide('app.Editor');

goog.require('app.soy.editor');
goog.require('goog.ui.Component');
goog.require('app.model.Entry');



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
      /** @type {Element} */(goog.soy.renderAsFragment(app.soy.editor.createDom)));
  this.draw();
  this.applyDependencyVisibility();
};

/**
 * @param {Object} opt_data .
 */
app.Editor.prototype.draw = function(opt_data) {
  if (!opt_data) {
    opt_data = {};
  }
  if (!opt_data.id) {
    opt_data.id = this.generateId();
  }
  if (!opt_data.mode) {
    opt_data.mode = 'action';
  }
  if (!opt_data.type) {
    opt_data.type = 'click';
  }
  goog.soy.renderElement(this.getElement(), app.soy.editor.renderContent, opt_data);
};

/** @inheritDoc */
app.Editor.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.enable(true);
};

app.Editor.prototype.enable = function(enable) {

  var eh = this.getHandler();
  var dh = this.getDomHelper();
  if (enable) {
    eh.listen(dh.getElement('editor-form'), 'submit', this.handleSubmit);
    eh.listen(this.getElement(), 'change', this.handleSelectChange);
    eh.listen(this.getElement(), 'click', this.handleClick);
    if (this.selectorInputHandler_) {
      this.selectorInputHandler_.dispose();
      this.selectorInputHandler_ = null;
    }
    this.selectorInputHandler_ = new goog.events.InputHandler(this.getElementByClass('entry-css'));
    eh.listen(this.selectorInputHandler_, goog.events.InputHandler.EventType.INPUT, this.handleSelectorTextKey);
    this.applyDependencyVisibility();
  } else {
    eh.unlisten(dh.getElement('editor-form'), 'submit', this.handleSubmit);
    eh.unlisten(this.getElement(), 'change', this.handleSelectChange);
    eh.unlisten(this.getElement(), 'click', this.handleClick);
    if (this.selectorInputHandler_) {
      eh.unlisten(this.selectorInputHandler_, goog.events.InputHandler.EventType.INPUT, this.handleSelectorTextKey);
      this.selectorInputHandler_.dispose();
      this.selectorInputHandler_ = null;
    }
  }

};

app.Editor.prototype.dispatchAppendEntryEvent = function(e) {
  this.dispatchEvent({
    type: 'append-entry',
    data: this.collectValues()
  });
}

app.Editor.prototype.handleSubmit = function(e) {
  this.dispatchAppendEntryEvent();;
  this.draw();
  e.preventDefault();
}

app.Editor.prototype.setRoughTitle = function(text) {
  goog.dom.forms.setValue(this.getElementByClass('entry-title'), text);
};

app.Editor.prototype.setSelectorText = function(text) {
  goog.dom.forms.setValue(this.getElementByClass('entry-css'), text);
};

app.Editor.prototype.handleSelectChange = function(e) {
  var selectEl = e.target;
  if (!selectEl.tagName == goog.dom.TagName.SELECT) {
    return;
  }
  this.applyDependencyVisibility();
};

app.Editor.prototype.handleClick = function(e) {
  var tmp;
  var el = e.target;
  if (goog.dom.contains(this.getElementByClass('selector-button'), el)) {
    this.dispatchEvent('enter-select-mode');

  } else if ((tmp = this.getElementByClass('quit-edit-button')) && goog.dom.contains(tmp, el)) {
    this.draw();
  }
};

app.Editor.prototype.handleSelectorTextKey = function(e) {
  this.dispatchEvent({
    type: 'selector-text-input',
    text: goog.dom.forms.getValue(this.getElementByClass('entry-css'))
  });
};

/***/
app.Editor.prototype.applyDependencyVisibility = function() {
  switch (goog.dom.forms.getValue(this.getElementByClass('entry-mode'))) {
    case 'action':
      goog.dom.forms.setDisabled(this.getElementByClass('entry-type-action'), false);
      goog.dom.forms.setDisabled(this.getElementByClass('entry-type-verify'), true);
      if (goog.dom.forms.getValue(this.getElementByClass('entry-type-action')) == 'click') {
        goog.dom.forms.setDisabled(this.getElementByClass('entry-text'), true);
      } else {
        goog.dom.forms.setDisabled(this.getElementByClass('entry-text'), false);
      }
      break;
    case 'verify':
      goog.dom.forms.setDisabled(this.getElementByClass('entry-type-action'), true);
      goog.dom.forms.setDisabled(this.getElementByClass('entry-type-verify'), false);
      goog.dom.forms.setDisabled(this.getElementByClass('entry-text'), false);
      break;
  }
};

/** @inheritDoc */
app.Editor.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};

/**
 * TODO* use this
 */
app.Editor.prototype.collectValues = function() {
  var map = goog.dom.forms.getFormDataMap(this.getElementByClass('editor-form'));
  var data = {};
  var prefix =  'entry-';
  map.forEach(function(v, k) {
    if (goog.string.startsWith(k, prefix)) {
      data[k.slice(prefix.length)] = v[0];
    }
  });
  return new app.model.Entry(data);
};

app.Editor.prototype.generateId = function() {
  return goog.string.getRandomString() + '-' + goog.string.getRandomString();
};

// /**
//  * @constructor
//  */
// app.Editor.Entry = function(map) {
//   this.id = map.get('entry-id')[0];
//   this.title = map.get('entry-title')[0];
//   this.css = map.get('entry-css')[0];
//   this.mode = map.get('entry-mode')[0];
//   this.type = map.get('entry-type')[0];
//   this.text = map.get('entry-text')[0];
//   Object.seal && Object.seal(this);
// };
