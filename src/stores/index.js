const Q = require('q');
Q.longStackSupport = true;
const {CHANGE_EVENT} = require('../constants');
const _ = require('underscore');
const Base = require('./base');

const default_ = {
  isSelectingElement: false,
  isSelectingBlock: false,
  targetElementBounds: null
};

class Store extends Base {
  constructor() {
    super();
    this.store_ = _.clone(default_);
  }
  dispatcherHandler_(action) {
    switch (action.type) {
    case 'startBlockSelect':
      this.store_.isSelectingBlock = action.enable;
      this.emit(CHANGE_EVENT);
      break;

    case 'enableSelectElement':
      this.store_.isSelectingElement = action.enable;
      if (action.select) {
        this.store_.targetElementBounds = null;
      }
      this.emit(CHANGE_EVENT);
      break;

    case 'mouseMove':
      this.store_.targetElementBounds = action.targetElementBounds;
      this.emit(CHANGE_EVENT);
      break;

    case 'selectIFrameElement':
      this.store_.isSelectingElement = false;
      break;
    }
  }
};
module.exports = new Store();
