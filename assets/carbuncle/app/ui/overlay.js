
goog.provide('app.ui.Overlay');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper .
 * @extends {goog.ui.Component}
 */
app.ui.Overlay = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(app.ui.Overlay, goog.ui.Component);

/**
 * @enum {string}
 */
app.ui.Overlay.EventType = {
  CANCEL: 'cancel'
};

/**
 * @param {boolean} show .
 */
app.ui.Overlay.prototype.show = function(show, opt_transitionend, opt_context) {
  if (!this.isInDocument()) this.render();
  goog.dom.classlist.enable(this.getElement(), 'open', show);

  if (opt_transitionend) {
    var eh = this.getHandler();
    eh.listenOnce(this.getElement(), goog.events.EventType.TRANSITIONEND, function (e) {
      opt_transitionend.call(opt_context, e);
    });
  }
};

/** @inheritDoc */
app.ui.Overlay.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var eh = this.getHandler();
  eh.listen(this.getElement(), 'click', this.handleClick);
};

/**
 * @param {goog.events.Event} e .
 */
app.ui.Overlay.prototype.handleClick = function(e) {
  if (e.target == this.getElement() ||
      e.target == this.getContentElement()) {
    this.dispatchEvent(app.ui.Overlay.EventType.CANCEL);
  }
};

/**
 * @param {string} title .
 */
app.ui.Overlay.prototype.setTitle = function(title) {
  this.title_ = title;
  var dh = this.getDomHelper();
  if (this.isInDocument()) {
    dh.setTextContent(this.getElementByClass( 'overlay-title'), this.title_);
  }
};

/** @inheritDoc */
app.ui.Overlay.prototype.createDom = function() {
  var dh = this.getDomHelper();
  this.setElementInternal(
    dh.createDom('div', 'overlay overlay-scale',
      dh.createDom('div', 'overlay-content',
        dh.createDom('h3', 'overlay-title', this.title_))));
};

/** @inheritDoc */
app.ui.Overlay.prototype.getContentElement = function() {
  return this.getElementByClass('overlay-content');
};
