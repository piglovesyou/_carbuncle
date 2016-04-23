const VerifyExplorer = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/verifyexplorer');
const {EventEmitter} = require('events');
const Selenium2 = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2');
const Locator = require('../modified-selenium-builder/seleniumbuilder/content/html/builder/locator');
const {dispatchChange} = require('../dispatcher');
const mix = require('../util/mix');

class SuperVerifyExplorer extends mix(VerifyExplorer, EventEmitter) {
  constructor(component, pushStep) {
    super();
    VerifyExplorer.call(this, component.iFrameWindow, Selenium2, pushStep, !pushStep);
    this.component = component;

    dispatchChange({ spotRect: {} });
    component.iFrameWindow.document.addEventListener('scroll', this.onDocumentScroll = this.onDocumentScroll.bind(this));
    this.styleEl_ = goog.style.installStyles('*{cursor:pointer!important}', component.iFrameWindow.document);
  }
  /** @override */
  handleMouseup(e) {
    super.handleMouseup(e);
    dispatchChange({ spotRect: null });
    // this.component.setState({ spotRect: null });
    this.emit('choose', this.lastLocator_);
  }
  /** @override */
  handleMouseover(e) {
    const locator = this.lastLocator_ = Locator.fromElement(e.target, true);
    const pos = goog.style.getFramedPageOffset(locator.getPreferredElement(), this.component.iFrameWindow);
    const size = goog.style.getBorderBoxSize(locator.getPreferredElement());
    const rect = this.lastRect_ = Object.assign(pos, size);
    const spotRect = Object.assign({}, rect);
    this.applyScrollPos(spotRect);
    dispatchChange({ spotRect });
  }
  /** @override */
  resetBorder() {}
  /** @override */
  destroy() {
    super.destroy();

    dispatchChange({ spotRect: null });
    // this.component.setState({spotRect: null});
    this.component.iFrameWindow.document.removeEventListener('scroll', this.onDocumentScroll);
    goog.style.installStyles(this.styleEl_);
  }
  onDocumentScroll(e) {
    if (!this.lastRect_) return;
    const spotRect = Object.assign({}, this.lastRect_);
    this.applyScrollPos(spotRect);
    dispatchChange({spotRect});
    // this.component.setState({spotRect});
  }
  applyScrollPos(pos) {
    pos.x -= this.component.iFrameWindow.document.body.scrollLeft;
    pos.y -= this.component.iFrameWindow.document.body.scrollTop;
  }
}

module.exports = SuperVerifyExplorer;
