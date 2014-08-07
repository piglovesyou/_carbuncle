
ObjectInterface = {};

/**
 * @constructor
 */
ObjectInterface.Entry = function () {};
ObjectInterface.Entry.prototype.id;

ObjectInterface.Json = {};

/**
 * @constructor
 */
ObjectInterface.Json.Progress = function() {};
ObjectInterface.Json.Progress.prototype.end;
ObjectInterface.Json.Progress.prototype.passed;
/** @type {ObjectInterface.Entry} */
ObjectInterface.Json.Progress.prototype.entry;
