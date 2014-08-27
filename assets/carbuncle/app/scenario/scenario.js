
goog.provide('app.Scenario');

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
          that.rows.redraw();
        }
        var id = String(data.entry.id);
        goog.dom.classlist.add(goog.dom.getElement(id), 'scenario-entry-doing');
        last = id;
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
    entries: this.rows.data.getAll() || [],
    isBlock: !!goog.dom.forms.getValue(this.getElementByClass('scenario-block'))
  };
  return rv;
};

app.Scenario.prototype.applyScenario = function(doc) {
  goog.dom.forms.setValue(this.getElementByClass('scenario-id'), doc.id);
  goog.dom.forms.setValue(this.getElementByClass('scenario-title'), doc.title);
  goog.dom.forms.setValue(this.getElementByClass('scenario-block'), doc.isBlock);
  this.rows.data.addAll(doc.entries || []);
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

    app.socket().then(function(socket) {
      app.mask.focus(this.getElement());
      that.makeButtonsEnabled(false);
      var params = that.collectScenario();
      goog.mixin(params, {
        'delay': 800
      });
      socket.post('/carbuncle/carbuncle/call', params, function(res) {
        if (res.error) {
          alert(res.stack);
        } else {
          // alert('success!');
        }
        app.mask.hide();
        that.makeButtonsEnabled(true);
      });
    }, null, this);


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
 * @param {goog.dom.DomHelper} opt_domHelper .
 */
app.Scenario.Rows = function(opt_domHelper) {
  goog.base(this, app.soy.scenario.renderEntry,
      new app.ui.Rows.Data('id'), opt_domHelper);
};
goog.inherits(app.Scenario.Rows, app.ui.Rows);

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

