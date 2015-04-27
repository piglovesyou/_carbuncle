
/**
 * @fileoverview I need Closure Library for an utility.
 */

goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.string');
goog.require('goog.dom.classlist');

goog.exportSymbol('goog.object.clone', goog.object.clone);
goog.exportSymbol('goog.dom.forms.getValue', goog.dom.forms.getValue);
goog.exportSymbol('goog.dom.getFrameContentDocument', goog.dom.getFrameContentDocument);
goog.exportSymbol('goog.dom.getChildren', goog.dom.getChildren);
goog.exportSymbol('goog.dom.getTextContent', goog.dom.getTextContent);
goog.exportSymbol('goog.style.getContainerOffsetToScrollInto', goog.style.getContainerOffsetToScrollInto);
goog.exportSymbol('goog.style.getPageOffset', goog.style.getPageOffset);
goog.exportSymbol('goog.style.getViewportPageOffset', goog.style.getViewportPageOffset);
goog.exportSymbol('goog.style.getBorderBoxSize', goog.style.getBorderBoxSize);
goog.exportSymbol('goog.crypt.Md5', goog.crypt.Md5);
goog.exportSymbol('goog.crypt.Md5.prototype.update', goog.crypt.Md5.prototype.update);
goog.exportSymbol('goog.crypt.Md5.prototype.digest', goog.crypt.Md5.prototype.digest);
goog.exportSymbol('goog.crypt.byteArrayToHex', goog.crypt.byteArrayToHex);
goog.exportSymbol('goog.array.removeIf', goog.array.removeIf);
goog.exportSymbol('goog.array.findIndex', goog.array.findIndex);
// goog.exportSymbol('goog.string.equal', goog.string.equal);
goog.exportSymbol('goog.string.contains', goog.string.contains);
goog.exportSymbol('goog.string.startsWith', goog.string.startsWith);
goog.exportSymbol('goog.string.endsWith', goog.string.endsWith);
goog.exportSymbol('goog.string.collapseWhitespace', goog.string.collapseWhitespace);
goog.exportSymbol('goog.string.isEmptyOrWhitespace', goog.string.isEmptyOrWhitespace);
goog.exportSymbol('goog.math.clamp', goog.math.clamp);
goog.exportSymbol('goog.dom.classlist.contains', goog.dom.classlist.contains);
