const React = require('react');

module.exports = { renderIcon, getIconKey };

function renderIcon(isBlock, mode, type) {
  const iconKey = getIconKey(isBlock, mode, type);
  if (iconKey) {
    return <i className={'fa fa-' + iconKey}></i>;
  }
  return null;
}

function getIconKey(isBlock, mode, type) {
  if (isBlock) {
    return 'cube';
  } else if (mode === 'action') {
    switch (type) {
    case 'click': return 'bullseye';
    case 'input': return 'pencil';
    case 'open': return 'globe';
    case 'screenshot': return 'camera';
    }
  } else if (mode === 'verify') {
    return 'check-square-o';
  } else if (mode === 'block') {
    return 'cube';
  }
  return undefined;
}
