
goog.provide('app.options');


/**
 * @return {app.Options} .
 */
app.options = function() {
  return app.Options.getInstance();
};

/**
 * @constructor
 */
app.Options = function() {
  var dataset = goog.dom.dataset.getAll(goog.dom.getDocument().body);

  /** @type {string} */
  this.site = dataset['site'];
};
goog.addSingletonGetter(app.Options);
