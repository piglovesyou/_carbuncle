
goog.provide('app.App');

goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events.EventTarget');
goog.require('goog.net.IframeLoadMonitor');
goog.require('goog.style');


/**
 * @constructor
 */
app.App = function() {
  var iframeEl = goog.dom.getElement('iframe');
  var doc = goog.dom.getFrameContentDocument(iframeEl);
  var pixelTop;
  var pixelRight;
  var pixelBottom;
  var pixelLeft;
  var pixel = goog.dom.createDom('div', 'worm-pixel',
      pixelTop = goog.dom.createDom('div', 'worm-pixel-border'),
      pixelRight = goog.dom.createDom('div', 'worm-pixel-border'),
      pixelBottom = goog.dom.createDom('div', 'worm-pixel-border'),
      pixelLeft = goog.dom.createDom('div', 'worm-pixel-border'));
  var selectorTextarea = goog.dom.getElementByClass('selector-textarea');

  enableSelectMode(true);

  var iframeMonitor = new goog.net.IframeLoadMonitor(iframeEl);
  if (iframeMonitor.isLoaded()) {
    handleIframeLoad();
  } else {
    goog.events.listen(iframeMonitor,
        goog.net.IframeLoadMonitor.LOAD_EVENT, handleIframeLoad);
  }


  goog.dom.append(document.body, pixel);



  function handleIframeLoad() {

    goog.events.listen(doc, 'click', function(e) {
      goog.dom.forms.setValue(selectorTextarea, buildSelector(e.target).join(' '));
    }, true);

    goog.events.listen(doc, 'mouseover', function(e) {
      var et = /** @type {Node} */(e.target);
      var iframePos = goog.style.getPageOffset(iframeEl);
      var pos = goog.style.getPageOffset(et);
      redrawPixel(
          new goog.math.Coordinate(iframePos.x + pos.x, iframePos.y + pos.y),
          goog.style.getBorderBoxSize(et),
          buildSelector(et));
    });
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

  function enableSelectMode(enable) {
    if (enable) {
      goog.events.listen(doc, 'click', stopPropagation, this, this);
    } else {
      goog.events.unlisten(doc, 'click', stopPropagation, this, this);
    }
  }

  function stopPropagation(e) {
    console.log('stop');
    e.stopPropagation();
    e.preventDefault();
  }

};
goog.inherits(app.App, goog.events.EventTarget);

