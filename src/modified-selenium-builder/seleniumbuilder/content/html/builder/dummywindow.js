const window = {};
window.sebuilder = {};
window.sebuilder.getRecordingWindow = () => global.carbuncleTargetFrame.contentWindow;
window.bridge = {};
window.bridge.getRecordingWindow = () => global.carbuncleTargetFrame.contentWindow;

module.exports = window;
