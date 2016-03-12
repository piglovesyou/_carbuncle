module.exports = {
  getAncestorFromEventTargetByClass
};

function getAncestorFromEventTargetByClass(end, hookCssName, et) {
  while (et && !goog.dom.classlist.contains(/** @type {Element} */(et), hookCssName)) {
    if (et === end) {
      return null;
    }
    et = et.parentNode;
  }
  return et;
}
