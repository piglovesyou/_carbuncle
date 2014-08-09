
goog.provide('app.options');


app.options = function () {
  return app.Options.getInstance();
}

app.Options = function () {
  var dataset = goog.dom.dataset.getAll(goog.dom.getDocument().body);

  /** @type {string} */
  this.site = dataset['site'];
}
goog.addSingletonGetter(app.Options);
