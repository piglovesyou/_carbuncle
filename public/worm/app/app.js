
goog.provide('app.App');

goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events.EventTarget');
goog.require('goog.events.InputHandler');
goog.require('goog.net.IframeLoadMonitor');
goog.require('goog.style');
goog.require('goog.ui.List');

var data;
var list;

/**
 * @constructor
 */
app.App = function() {


  // DOM
  var iframeEl = goog.dom.getElement('iframe');
  var iframeDocument = goog.dom.getFrameContentDocument(iframeEl);

  var pixelTopEl, pixelRightEl, pixelBottomEl, pixelLeftEl,
      pixelEl = goog.dom.createDom('div', 'worm-pixel',
        pixelTopEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-top'),
        pixelRightEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-right'),
        pixelBottomEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-bottom'),
        pixelLeftEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-left'));

  var selectorTextareaEl = goog.dom.getElementByClass('selector-textarea');
  var selectorButtonEl = goog.dom.getElementByClass('selector-button-a');
  var editorTitleInputEl = goog.dom.getElementByClass('editor-title-input');
  var maskEl = goog.dom.getElementByClass('mask');
  var scenarioEl = goog.dom.getElementByClass('scenario');

  goog.dom.append(document.body, pixelEl);



  var selectorTextareaInputHandler = new goog.events.InputHandler(selectorTextareaEl);








  var selectEnabled = false;
  function enableSelectMode(enable) {
    selectEnabled = enable;
    goog.style.setElementShown(maskEl, enable);
    if (enable) {
      goog.events.unlisten(selectorButtonEl, 'click', handleSelectorButtonClick, false);
      goog.events.unlisten(selectorTextareaInputHandler, goog.events.InputHandler.EventType.INPUT, handleSelectorTextKey);
      goog.events.listen(iframeDocument, 'click', stopPropagation, true);
      goog.events.listen(iframeDocument, 'click', handleIframeClick, true);
      goog.events.listen(iframeDocument, 'mouseover', handleIframeMouseOver);
    } else {
      goog.events.listen(selectorButtonEl, 'click', handleSelectorButtonClick, false);
      goog.events.listen(selectorTextareaInputHandler, goog.events.InputHandler.EventType.INPUT, handleSelectorTextKey);
      goog.events.unlisten(iframeDocument, 'click', stopPropagation, true);
      goog.events.unlisten(iframeDocument, 'click', handleIframeClick, true);
      goog.events.unlisten(iframeDocument, 'mouseover', handleIframeMouseOver);
    }
  }

  function handleSelectorTextKey(e) {
    console.log(goog.dom.forms.getValue(e.target));
  }

  function handleSelectorButtonClick(e) {
    enableSelectMode(true);
  }

  function handleIframeClick(e) {
    goog.dom.forms.setValue(selectorTextareaEl, buildSelector(e.target).join(' '));
    goog.dom.forms.setValue(editorTitleInputEl, goog.dom.getTextContent(e.target));
    enableSelectMode(false);
  }

  function handleIframeMouseOver(e) {
    var et = /** @type {Node} */(e.target);
    var iframePos = getIframePosision();
    var pos = goog.style.getPageOffset(et);
    redrawPixel(
        new goog.math.Coordinate(iframePos.x + pos.x, iframePos.y + pos.y),
        goog.style.getBorderBoxSize(et),
        buildSelector(et));
  }

  function getIframePosision() {
    var pos = goog.style.getPageOffset(iframeEl);
    pos.x += parseInt(goog.style.getComputedStyle(iframeEl, 'borderLeftWidth'), 10);
    pos.y += parseInt(goog.style.getComputedStyle(iframeEl, 'borderTopWidth'), 10);
    return pos;
  }

  function redrawPixel(pos, size, description) {
    goog.style.setPosition(pixelEl, pos);

    goog.style.setWidth(pixelTopEl, size.width);
    goog.style.setWidth(pixelBottomEl, size.width);
    goog.style.setHeight(pixelLeftEl, size.height);
    goog.style.setHeight(pixelRightEl, size.height);

    goog.style.setPosition(pixelRightEl, size.width, 0);
    goog.style.setPosition(pixelBottomEl, 0, size.height);
  }

  function buildSelector(node) {
    var rv = [];
    do {
      rv.push(node.tagName.toLowerCase() +
          (node.id ? '#' + node.id : '') +
          (node.className ? '.' + node.className.split(' ').join('.') : ''));
    } while ((node = node.parentNode) && node && node.tagName && node.tagName.toLowerCase() != 'html');
    return rv.reverse();
  }

  function stopPropagation(e) {
    console.log('stop');
    e.stopPropagation();
    e.preventDefault();
  }

  function handleIframeLoad() {
    enableSelectMode(false);

    // data = new goog.ui.list.Data;
    // list = new goog.ui.List(function(item) {
    //   return item.title;
    // });
    // list.renderBefore(goog.dom.getElementByClass('scenario-footer'));
    // goog.dom.classes.add(list.getElement(), 'scenario-list');
  }


  var iframeMonitor = new goog.net.IframeLoadMonitor(iframeEl);
  if (iframeMonitor.isLoaded()) {
    handleIframeLoad();
  } else {
    goog.events.listen(iframeMonitor,
        goog.net.IframeLoadMonitor.LOAD_EVENT, handleIframeLoad);
  }
};
goog.inherits(app.App, goog.events.EventTarget);

