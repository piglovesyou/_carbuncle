const Path = require('path');

class StdoutReplacer {
  constructor() {
    this.shouldClear_ = false;
    this.delimiter_ = '...';
  }
  out(str) {
    this.clear();
    const max = process.stdout.columns;
    const shortened = str.length <= max ? str
      : str.length.slice(0, max - this.delimiter_.length) + this.delimiter_;
    process.stdout.write(shortened);
  }
  clear() {
    if (this.shouldClear_) this.clear_();
    this.shouldClear_ = true;
  }
  clear_() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

module.exports = StdoutReplacer;
module.exports.shortenPath = shortenPath;

function shortenPath(path, max, delimiter = '...') {
  if (path.length <= max) {
    return path;
  }
  var basename = Path.basename(path);
  return path.slice(0, max - delimiter.length - basename.length) +
    delimiter + basename;
}

