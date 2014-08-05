
goog.provide('app.Scenario');

goog.require('app.dom');
goog.require('app.mask');
goog.require('app.soy.scenario');
goog.require('app.ui.Rows');
goog.require('goog.dom.dataset');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {app.ui.Rows}
 */
app.Scenario = function(opt_domHelper) {
  goog.base(this, app.soy.scenario.renderEntry,
      new app.ui.Rows.Data('id'), opt_domHelper);
};
goog.inherits(app.Scenario, app.ui.Rows);

/**
 * @enum {string}
 */
app.Scenario.EventTarget = {
  EDIT_ENTRY: 'editentry'
};

/** @inheritDoc */
app.Scenario.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var eh = this.getHandler();
  eh.listen(this.getElement(), 'click', this.handleClick);
};

/**
 * @param {goog.events.Every} e .
 */
app.Scenario.prototype.handleClick = function(e) {
  var et = /** @type {Element} */(e.target);

  if (goog.dom.classes.has(et, 'scenario-entry-edithook')) {
    var entry = this.getEntryFromEventTarget(et);
    if (entry) {
      this.dispatchEvent({
        type: 'editentry',
        data: entry
      });
    }
    return;
  }

  if (goog.dom.classes.has(et, 'scenario-entry-deletehook')) {
    var entry = this.getEntryFromEventTarget(et);
    if (entry) {
      this.data.remove(entry);
      this.redraw();
    }
    return;
  }

  if (goog.dom.classes.has(et, 'scenario-footer-preview')) {

    var that = this;
    app.socket().then(function(socket) {
      app.mask.focus(this.getElement());
      goog.soy.renderElement(that.getElementByClass('scenario-footer'),
          app.soy.scenario.footerContent, {disabled: true});
      socket.post('/utsubo/set/preview', {
        entries: this.data.getAll()
      }, function(res) {
        if (res.error) {
          console.log(res.stack);
          alert(res.stack);
        } else {
          alert('success!')
        }
        app.mask.hide();
        goog.soy.renderElement(that.getElementByClass('scenario-footer'),
            app.soy.scenario.footerContent);
      });
    }, null, this);


  } else if (goog.dom.classes.has(et, 'scenario-footer-reset')) {
    this.data.clear();
    this.redraw();

  } else if (goog.dom.classes.has(et, 'scenario-footer-save')) {
    app.socket().then(function(socket) {
      socket.post('/utsubo/set', {
        entries: this.data.getAll()
      }, function(res) {
        console.log('====done..?', res);
      });
    }, null, this);
  }
};

/**
 * @param {Node} et
 * @return {Object}
 */
app.Scenario.prototype.getEntryFromEventTarget = function(et) {
  var entryEl = app.dom.getAncestorFromEventTargetByClass(this.getElement(), 'scenario-entry', et);
  if (entryEl) {
    return this.data.get(goog.dom.dataset.get(entryEl, 'id'));
  }
  return null;
};

/** @inheritDoc */
app.Scenario.prototype.createDom = function() {
  this.setElementInternal(
      /** @type {Element} */(goog.soy.renderAsFragment(app.soy.scenario.createDom)));
};

/** @inheritDoc */
app.Scenario.prototype.getContentElement = function() {
  return this.getElementByClass('scenario-body');
};
