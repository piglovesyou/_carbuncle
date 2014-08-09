
goog.provide('app.model.Entry');

/**
 * @constructor
 * @param {Object} data .
 */
app.model.Entry = function(data) {
  this.id = data['id'];
  this.title = data['title'];
  this.css = data['css'];
  this.mode = data['mode'];
  this.type = data['type'];
  this.text = data['text'];
  this.entries = data['entries'];
  Object.seal && Object.seal(this);
};

