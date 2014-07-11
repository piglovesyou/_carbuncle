
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
  var iframeEl = goog.dom.getElement('iframe');
  var iframeDocument = goog.dom.getFrameContentDocument(iframeEl);

  var pixelTop, pixelRight, pixelBottom, pixelLeft,
      pixel = goog.dom.createDom('div', 'worm-pixel',
        pixelTop = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-top'),
        pixelRight = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-right'),
        pixelBottom = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-bottom'),
        pixelLeft = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-left'));

  var selectorTextarea = goog.dom.getElementByClass('selector-textarea');
  var selectorTextareaInputHandler = new goog.events.InputHandler(selectorTextarea);
  var selectorButton = goog.dom.getElementByClass('selector-button-a');
  var editorTitleInput = goog.dom.getElementByClass('editor-title-input');
  var mask = goog.dom.getElementByClass('mask');
  var sinarioList = goog.dom.getElementByClass('sinario-list');

  goog.dom.append(document.body, pixel);









  var selectEnabled = false;
  function enableSelectMode(enable) {
    selectEnabled = enable;
    goog.style.setElementShown(mask, enable);
    if (enable) {
      goog.events.unlisten(selectorButton, 'click', handleSelectorButtonClick, false);
      goog.events.unlisten(selectorTextareaInputHandler, goog.events.InputHandler.EventType.INPUT, handleSelectorTextKey);
      goog.events.listen(iframeDocument, 'click', stopPropagation, true);
      goog.events.listen(iframeDocument, 'click', handleIframeClick, true);
      goog.events.listen(iframeDocument, 'mouseover', handleIframeMouseOver);
    } else {
      goog.events.listen(selectorButton, 'click', handleSelectorButtonClick, false);
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
    goog.dom.forms.setValue(selectorTextarea, buildSelector(e.target).join(' '));
    goog.dom.forms.setValue(editorTitleInput, goog.dom.getTextContent(e.target));
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
    goog.style.setPosition(pixel, pos);

    goog.style.setWidth(pixelTop, size.width);
    goog.style.setWidth(pixelBottom, size.width);
    goog.style.setHeight(pixelLeft, size.height);
    goog.style.setHeight(pixelRight, size.height);

    goog.style.setPosition(pixelRight, size.width, 0);
    goog.style.setPosition(pixelBottom, 0, size.height);
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

    data = new goog.ui.list.Data;
    list = new goog.ui.List(function(item) {
      return item.title;
    });
    list.renderBefore(goog.dom.getElementByClass('sinario-footer'));
    goog.dom.classes.add(list.getElement(), 'sinario-list');
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

