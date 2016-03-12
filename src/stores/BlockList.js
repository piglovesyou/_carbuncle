const ScenarioListBase = require('./ScenarioListBase');

class BlockList extends ScenarioListBase {
  constructor() {
    super();
    this.filter = {isBlock: true};
  }
}

module.exports = new BlockList();
