
goog.provide('app.Scenario');

goog.require('app.bus');
goog.require('app.dao');
goog.require('app.dom');
goog.require('app.mask');
goog.require('app.scenario.BlockSelector');
goog.require('app.socket');
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
 * @extends {goog.ui.Component}
 */
app.Scenario = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  /**
   * @type {app.Scenario.Rows}
   */
  this.rows = new app.Scenario.Rows;
  this.addChild(this.rows);
};
goog.inherits(app.Scenario, goog.ui.Component);

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

  var clearTimer = new goog.Delay(this.rows.redraw, 3000, this.rows);

  app.dao.scenario().then(function(scenario) {

    scenario.findOne({}, function(err, doc) {
      if (doc) {
        that.applyScenario(/** @type {ObjectInterface.Scenario} */(doc));
      }
    });

  });

  (function() {
    // Reference to the last entry during previewing
    var last;

    app.bus.scenario.subscribe('before', function(data) {
      if (!last) {
        clearTimer.stop();
        that.rows.useTemporaryData(true);
        that.rows.redraw();
      } else {
        passLast();
      }
      last = String(data.entry.id);
      decorateStepEl(null, 'scenario-entry-doing');
      if (data.entry.mode == 'block') {
        goog.array.forEach(data.entry.entries, that.rows.data.add, that.rows.data);
        that.rows.redraw();
      }
    });

    app.bus.scenario.subscribe('pass', function() {
      passLast();
      end();
    });

    app.bus.scenario.subscribe('fail', function(data) {
      decorateStepEl(null, 'scenario-entry-fail');
      end();
    });

    function passLast() {
      decorateStepEl('scenario-entry-doing', 'scenario-entry-done');
    }
    function end() {
      last = null;
      clearTimer.start();
      that.rows.useTemporaryData(false);
    }
    function decorateStepEl(removeClass, addClass) {
      var stepEl = goog.dom.getElement(last);
      goog.dom.classlist.addRemove(stepEl, removeClass, addClass);
      goog.style.scrollIntoContainerView(stepEl, that.rows.getElement());
    }
  })();

  eh.listen(this, [app.ui.Overlay.EventType.CANCEL,
                   app.ui.ScenarioGrid.SELECT], function(e) {
    if (e.data) {
      this.rows.insertBlock(e.data);
    }
    this.blockSelector.show(false, function() {
      this.blockSelector.dispose();
      this.blockSelector = null;
    }, this);
  });


};

/**
 * @return { { id, title, entries } }
 */
app.Scenario.prototype.collectScenario = function() {
  var tmp;
  var rv = {
    '_id': goog.dom.forms.getValue(this.getElementByClass('scenario-id')),
    'title': /** @type {string} */(goog.dom.forms.getValue(this.getElementByClass('scenario-title'))),
    'entries': this.rows.data.getAll() || [],
    'isBlock': !!goog.dom.forms.getValue(this.getElementByClass('scenario-block'))
  };
  return rv;
};

app.Scenario.prototype.applyScenario = function(doc) {
  goog.dom.forms.setValue(this.getElementByClass('scenario-id'), doc['_id']);
  goog.dom.forms.setValue(this.getElementByClass('scenario-title'), doc['title']);
  goog.dom.forms.setValue(this.getElementByClass('scenario-block'), doc['isBlock']);
  this.rows.data.addAll(doc['entries'] || []);
  this.rows.redraw();
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
      this.rows.data.remove(entry);
      this.rows.redraw();
    }
    return;
  }

  if (goog.dom.classes.has(et, 'scenario-footer-preview')) {

    app.mask.focus(this.getElement());
    app.mask.hide();
    app.bus.scenario.preview(that.collectScenario(), 800)

    // app.socket().then(function(socket) {

      // that.makeButtonsEnabled(false);
      // var params = that.collectScenario();
      // goog.mixin(params, { 'delay': 800 });


      // that.makeButtonsEnabled(true);

      // TODO: carbuncle executor
      // socket.post('/carbuncle/carbuncle/call', params, function(res) {
      //   app.mask.hide();
      //   that.makeButtonsEnabled(true);
      // });

    // }, null, this);


  } else if (goog.dom.classes.has(et, 'scenario-footer-create')) {
    this.rows.data.clear();
    this.rows.redraw();
    goog.soy.renderElement(this.getElementByClass('scenario-header'), app.soy.scenario.headerContent);
    goog.soy.renderElement(this.getElementByClass('scenario-body'), app.soy.scenario.bodyContent);
    goog.soy.renderElement(this.getElementByClass('scenario-footer'), app.soy.scenario.footerContent);

  } else if (goog.dom.classes.has(et, 'scenario-body-insertblock')) {
    if (this.blockSelector) return;
    this.addChild(this.blockSelector = new app.scenario.BlockSelector);
    this.blockSelector.show(true);

  } else if (goog.dom.classes.has(et, 'scenario-footer-save')) {
    this.makeButtonsEnabled(false);
    app.dao.scenario().then(function(scenario) {
      scenario.upsertById(that.collectScenario(), function(err, doc) {
        that.makeButtonsEnabled(true);
        if (err) return;
        that.applyScenario(doc);
      });
    });
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
    return this.rows.data.get(goog.dom.dataset.get(entryEl, 'id'));
  }
  return null;
};

/** @inheritDoc */
app.Scenario.prototype.createDom = function() {
  this.setElementInternal(
      /** @type {Element} */(goog.soy.renderAsFragment(app.soy.scenario.createDom)));
  this.rows.decorate(this.getElementByClass('scenario-body'));
};






/**
 * @constructor
 * @extends {app.ui.Rows}
 * @param {goog.dom.DomHelper=} opt_domHelper .
 */
app.Scenario.Rows = function(opt_domHelper) {
  goog.base(this, app.soy.scenario.renderEntry,
      app.Scenario.Rows.createData(), opt_domHelper);
  this.original_ = this.data;
};
goog.inherits(app.Scenario.Rows, app.ui.Rows);

app.Scenario.Rows.createData = function() {
  return new app.ui.Rows.Data('id');
};

/**
 * @param {boolean} temporary .
 */
app.Scenario.Rows.prototype.useTemporaryData = function(temporary) {
  if (temporary) {
    this.data = /** @type {app.ui.Rows.Data} */(goog.object.unsafeClone(this.original_));
    goog.removeUid(this.data);
  } else {
    goog.asserts.assert(this.data);
    goog.asserts.assert(goog.getUid(this.data) != goog.getUid(this.original_));
    this.data.dispose();
    this.data = this.original_;
  }
};

app.Scenario.Rows.prototype.insertBlock = function(data) {
  this.data.add({
    id: data.id,
    title: data && data.title, // Can be null
    mode: 'block'
  });
  this.redraw();
};

/** @inheritDoc */
app.Scenario.Rows.prototype.getContentElement = function() {
  return this.getElementByClass('scenario-body-container');
};
