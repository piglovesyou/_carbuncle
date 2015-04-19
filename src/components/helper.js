var React = require('react');

module.exports = { renderIcon };

function renderIcon(mode, type) {
  var iconKey;
  if (mode === 'action') {
    switch(type) {
      case 'click': iconKey = 'bullseye'; break;
      case 'input': iconKey = 'pencil'; break;
      case 'open': iconKey = 'globe'; break;
      case 'screenshot': iconKey = 'camera'; break;
    }
  } else if (mode === 'verify') {
    iconKey = 'check-square-o';
  } else if (mode === 'block') {
    iconKey = 'cube';
  }
  if (iconKey) {
    return <i className={'fa fa-' + iconKey}></i>;
  }
  return null;
}
