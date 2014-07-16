
goog.provide('app.App');

goog.require('goog.dom.forms');
goog.require('app.Scenario');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events.EventTarget');
goog.require('goog.events.InputHandler');
goog.require('goog.net.IframeLoadMonitor');
goog.require('goog.style');
goog.require('app.Editor');

var iframeEl;
var iframeDocument;

var pixelTopEl;
var pixelRightEl;
var pixelBottomEl;
var pixelLeftEl;
var pixelEl;
var pixelTopEl;
var pixelRightEl;
var pixelBottomEl;
var pixelLeftEl;

var selectorTextareaEl;
var selectorButtonEl;
var editorTitleInputEl;
var maskEl;
var scenarioEl;
var editorActionEl;
var editorVerifyEl;
var editorModeSelectEl;
var editorActionSelectEl;
var editorVerifySelectEl;
var editorVerifyInputEl;
var appendButtonEl;

var selectorTextareaInputHandler;
var scenario;

var selectEnabled = false;
var iframeMonitor;



/**
 * @constructor
 */
app.App = function() {

  var editor = new app.Editor;
  editor.renderBefore(goog.dom.getElementByClass('main'));

  // DOM
  iframeEl = goog.dom.getElement('iframe');
  iframeDocument = goog.dom.getFrameContentDocument(iframeEl);

  pixelEl = goog.dom.createDom('div', {className: 'worm-pixel', style: 'display:none'},
    pixelTopEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-top'),
    pixelRightEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-right'),
    pixelBottomEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-bottom'),
    pixelLeftEl = goog.dom.createDom('div', 'worm-pixel-border worm-pixel-border-left'));

  selectorTextareaEl = goog.dom.getElementByClass('selector-textarea');
  selectorButtonEl = goog.dom.getElementByClass('selector-button-a');
  editorTitleInputEl = goog.dom.getElementByClass('editor-title-input');
  maskEl = goog.dom.getElementByClass('mask');
  scenarioEl = goog.dom.getElementByClass('scenario');
  editorActionEl = goog.dom.getElementByClass('action-select');
  editorVerifyEl = goog.dom.getElementByClass('verify-select');
  editorModeSelectEl = goog.dom.getElementByClass('mode-select');
  editorActionSelectEl = goog.dom.getElementsByTagNameAndClass('select', null, editorActionEl)[0];
  editorVerifySelectEl = goog.dom.getElementsByTagNameAndClass('select', null, editorVerifyEl)[0];
  editorVerifyInputEl = goog.dom.getElementsByTagNameAndClass('input', null, editorVerifyEl)[0];
  appendButtonEl = goog.dom.getElementsByTagNameAndClass('a', null, goog.dom.getElementByClass('append'))[0];

  console.log(appendButtonEl);

  goog.dom.append(document.body, pixelEl);



  selectorTextareaInputHandler = new goog.events.InputHandler(selectorTextareaEl);
  scenario = new app.Scenario;

  (iframeMonitor = new goog.net.IframeLoadMonitor(iframeEl)).isLoaded() ?
    handleIframeLoad() :
    goog.events.listen(iframeMonitor, goog.net.IframeLoadMonitor.LOAD_EVENT, handleIframeLoad);




  function handleIframeLoad() {





    enableSelectMode(false);

    scenario.decorate(scenarioEl);

    // setupModeSelector();
  }




  function enableSelectMode(enable) {
    selectEnabled = enable;
    goog.style.setElementShown(maskEl, enable);
    if (enable) {
      goog.events.unlisten(selectorButtonEl, 'click', handleSelectorButtonClick, false);
      goog.events.unlisten(selectorTextareaInputHandler, goog.events.InputHandler.EventType.INPUT, handleSelectorTextKey);
      goog.events.unlisten(appendButtonEl, 'click', handleAppendButtonClick);
      goog.events.listen(iframeDocument, 'click', stopPropagation, true);
      goog.events.listen(iframeDocument, 'click', handleIframeClick, true);
      goog.events.listen(iframeDocument, 'mouseover', handleIframeMouseOver);
    } else {
      goog.events.listen(selectorButtonEl, 'click', handleSelectorButtonClick, false);
      goog.events.listen(selectorTextareaInputHandler, goog.events.InputHandler.EventType.INPUT, handleSelectorTextKey);
      goog.events.listen(appendButtonEl, 'click', handleAppendButtonClick);
      goog.events.unlisten(iframeDocument, 'click', stopPropagation, true);
      goog.events.unlisten(iframeDocument, 'click', handleIframeClick, true);
      goog.events.unlisten(iframeDocument, 'mouseover', handleIframeMouseOver);
    }
  }

  function handleAppendButtonClick(e) {
    var v = collectValues();
    if (v.title && isElementExists(v.selector))
      scenario.append(v);
  }

  function handleSelectorTextKey(e) {
    try {
      var el = iframeDocument.querySelector(goog.dom.forms.getValue(e.target));
      if (el) {
        redrawPixel(el);
        return;
      }
    } catch (e) {}
    showPixel(false);
  }

  function handleSelectorButtonClick(e) {
    enableSelectMode(true);
  }

  function handleIframeClick(e) {
    goog.dom.forms.setValue(selectorTextareaEl, buildSelector(e.target));
    goog.dom.forms.setValue(editorTitleInputEl, goog.dom.getTextContent(e.target));
    enableSelectMode(false);
  }

  function handleIframeMouseOver(e) {
    var et = /** @type {Node} */(e.target);
    redrawPixel(et);
  }

  function getIframePosision() {
    var pos = goog.style.getPageOffset(iframeEl);
    pos.x += parseInt(goog.style.getComputedStyle(iframeEl, 'borderLeftWidth'), 10);
    pos.y += parseInt(goog.style.getComputedStyle(iframeEl, 'borderTopWidth'), 10);
    return pos;
  }

  function redrawPixel(el) {
    var iframePos = getIframePosision();
    var pos = goog.style.getPageOffset(el);
    redrawPixel_(
        new goog.math.Coordinate(iframePos.x + pos.x, iframePos.y + pos.y),
        goog.style.getBorderBoxSize(el),
        buildSelector(el));
  }

  function redrawPixel_(pos, size, description) {
    showPixel(true);
    goog.style.setPosition(pixelEl, pos);

    goog.style.setWidth(pixelTopEl, size.width);
    goog.style.setWidth(pixelBottomEl, size.width);
    goog.style.setHeight(pixelLeftEl, size.height);
    goog.style.setHeight(pixelRightEl, size.height);

    goog.style.setPosition(pixelRightEl, size.width, 0);
    goog.style.setPosition(pixelBottomEl, 0, size.height);
  }

  function showPixel(show) {
    goog.style.setElementShown(pixelEl, show);
  }

  function isElementExists(selector) {
    try {
      return !!iframeDocument.querySelector(selector);
    } catch (e) {}
    return false;
  }

  /**
   * @param {Element} targetNode .
   * @return {string} .
   */
  function buildSelector(targetNode) {
    var rv = [];
    var node = targetNode;
    do {
      var builder = [];
      builder.push(node.tagName.toLowerCase());
      // TODO: It depends on each application to use DOM id because it can be a unique id.
      // builder.push(node.id ? '#' + node.id : '');
      builder.push(node.className ? '.' + node.className.split(' ').join('.') : '');
      var tmpIndex = getChildIndex(node);
      if (tmpIndex > 0) {
        builder.push(':nth-child(' + (tmpIndex + 1) + ')');
      }
      rv.push(builder.join(''));
    } while ((node = node.parentNode) && node && node.tagName && node.tagName.toLowerCase() != 'html');
    rv.reverse();
    if (iframeDocument.querySelector(rv.join(' ')) !== targetNode) {
      return null;
    }
    return rv.join(' ');
  }

  function getChildIndex(node) {
    var children = goog.dom.getChildren(node.parentNode);
    if (node.parentNode && children.length > 1) {
      for (var i = 0, item = children[i]; i < children.length; item = children[++i]) {
        if (node === item) {
          return i;
        }
      }
    }
    return -1;
  }

  function stopPropagation(e) {
    e.stopPropagation();
    e.preventDefault();
  }



  // function setupModeSelector() {
  //   goog.events.listen(editorModeSelectEl, 'change', toggleModeSelectorDependers);
  //   toggleModeSelectorDependers();
  // }

  // function toggleModeSelectorDependers() {
  //   switch (goog.dom.forms.getValue(editorModeSelectEl)) {
  //     case 'action':
  //       goog.style.setElementShown(editorActionEl, true);
  //       goog.style.setElementShown(editorVerifyEl, false);
  //       break;
  //     case 'verify':
  //       goog.style.setElementShown(editorActionEl, false);
  //       goog.style.setElementShown(editorVerifyEl, true);
  //       break;
  //   }
  // }

  function collectValues() {
    return {
      title: goog.dom.forms.getValue(editorTitleInputEl),
      selector: goog.dom.forms.getValue(selectorTextareaEl),
      mode: goog.dom.forms.getValue(editorModeSelectEl),
      action: goog.dom.forms.getValue(editorActionSelectEl),
      verify: goog.dom.forms.getValue(editorVerifySelectEl),
      verifyText: goog.dom.forms.getValue(editorVerifyInputEl)
    };
  }

};
goog.inherits(app.App, goog.events.EventTarget);

