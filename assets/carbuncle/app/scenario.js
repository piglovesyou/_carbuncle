
goog.provide('app.Scenario');

goog.require('app.dom');
goog.require('app.mask');
goog.require('app.soy.scenario');
goog.require('app.ui.Rows');
goog.require('goog.Delay');
goog.require('goog.dom.classes');
goog.require('goog.dom.classlist');
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
  var that = this;
  var eh = this.getHandler();

  eh.listen(this.getElement(), 'click', this.handleClick);

  var clearTimer = new goog.Delay(this.redraw, 3000, this);
  app.socket().then(function(socket) {

    socket.get('/carbuncle/scenario', function(res) {
      var scenario = res && !goog.array.isEmpty(res) && goog.array.peek(res);
      if (scenario) {
        that.applyScenario(/** @type {ObjectInterface.Scenario} */(scenario));
      }
      var last;
      socket.on('before', function(data) {
        if (last) {
          passLast();
        } else {
          clearTimer.stop();
          that.redraw();
        }
        goog.dom.classlist.add(goog.dom.getElement(data.entry.id),
            'scenario-entry-doing');
        last = data.entry.id;
      });

      socket.on('pass', function() {
        passLast();
        end();
      });
      socket.on('fail', function(data) {
        goog.dom.classlist.add(goog.dom.getElement(last),
            'scenario-entry-fail');
        end();
      });

      function passLast() {
        goog.dom.classlist.addRemove(goog.dom.getElement(last),
            'scenario-entry-doing', 'scenario-entry-done');
      }
      function end() {
        last = null;
        clearTimer.start();
      }
    });

  });

};

/**
 * @return { {
 *    id: ?string,
 *    title: string,
 *    entries: Array.<app.model.Entry>
 *  } }
 */
app.Scenario.prototype.collectScenario = function() {
  var tmp;
  var rv = {
    id: !isNaN(tmp = parseInt(goog.dom.forms.getValue(this.getElementByClass('scenario-id')), 10)) ? tmp : undefined,
    title: goog.dom.forms.getValue(this.getElementByClass('scenario-title')),
    entries: this.data.getAll() || []
  };
  return rv;
};

app.Scenario.prototype.applyScenario = function(doc) {
  goog.dom.forms.setValue(this.getElementByClass('scenario-id'), doc.id);
  goog.dom.forms.setValue(this.getElementByClass('scenario-title'), doc.title);
  this.data.addAll(doc.entries || []);
  this.redraw();
};

/**
 * @param {goog.events.Event} e .
 */
app.Scenario.prototype.handleClick = function(e) {
  var et = /** @type {Element} */(e.target);
  var that = this;

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

    app.socket().then(function(socket) {
      app.mask.focus(this.getElement());
      that.makeButtonsEnabled(false);
      socket.post('/carbuncle/scenario/preview', that.collectScenario(), function(res) {
        if (res.error) {
          alert(res.stack);
        } else {
          // alert('success!');
        }
        app.mask.hide();
        that.makeButtonsEnabled(true);
      });
    }, null, this);


  } else if (goog.dom.classes.has(et, 'scenario-footer-reset')) {
    this.data.clear();
    this.redraw();

  } else if (goog.dom.classes.has(et, 'scenario-footer-save')) {
    this.makeButtonsEnabled(false);
    app.socket().then(function(socket) {
      socket.post('/carbuncle/scenario/upsert', that.collectScenario(), function(doc) {
        that.makeButtonsEnabled(true);
        that.applyScenario(doc);
      });
    }, goog.bind(that.makeButtonsEnabled, that, true));
  }
};

/**
 * @param {boolean} enable .
 */
app.Scenario.prototype.makeButtonsEnabled = function(enable) {
  goog.soy.renderElement(this.getElementByClass('scenario-footer'),
      app.soy.scenario.footerContent, {disabled: !enable});
};

/**
 * @param {Node} et
 * @return {Object}
 */
app.Scenario.prototype.getEntryFromEventTarget = function(et) {
  var entryEl = /** @type {Element} */(
      app.dom.getAncestorFromEventTargetByClass(this.getElement(), 'scenario-entry', et));
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
