import { SpeedParser } from "./index";
import { loadOptionItems } from "../options";

class AutoScroller {
  constructor() {
    this.intervalId = -1;
    this.x = 0;
    this.y = 0;
    this.scrollingElement = null;
    this.scrollingStep = -1;
    this.scrollingInterval = -1;
    this.isCursorOnText = false;
    this.onStopListener = undefined;
  }

  init() {
    this.parser = new SpeedParser();
    this.options = loadOptionItems();
    for (const key of Object.keys(this.options)) {
      this.options[key].init();
    }

    this.onMouseoverListener = this.onMouseoverListener.bind(this);
    this.onMouseoutListener = this.onMouseoutListener.bind(this);
    this.onClickListener = this.onClickListener.bind(this);
  }

  start() {
    this.scrollingElement = this.getScrollingElement();
    this.setScrollingSpeed();
    this.addUserActionListeners();
    this._setScrolling();
  }

  _setScrolling() {
    this.intervalId = window.setInterval(
      this.scroll.bind(this),
      this.scrollingInterval
    );
  }

  scroll() {
    if (this.needToStopScrolling()) return;
    this._oneScroll();
  }

  _oneScroll() {
    this.y = this.y + this.scrollingStep;
    this.scrollingElement.scroll(this.x, this.y);
  }

  needToStopScrolling() {
    //if (this.options.stop this.isCursorOnText
  }

  stop() {
    this.removeUserActionListeners();
    this._clearScrolling();
  }

  _clearScrolling() {
    window.clearInterval(this.intervalId);
  }

  setScrollingSpeed() {
    const { step, interval } = this.parser.parse(
      this.options.scrollingSpeed.value
    );
    this.scrollingStep = step;
    this.scrollingInterval = interval;
  }

  getScrollingElement() {
    return document.scrollingElement
      ? document.scrollingElement
      : document.documentElement;
  }

  addUserActionListeners() {
    document.body.addEventListener("mouseover", this.onMouseoverListener);
    document.body.addEventListener("mouseout", this.onMouseoutListener);
    document.body.addEventListener("click", this.onClickListener);
  }

  removeUserActionListeners() {
    document.body.removeEventListener("mouseover", this.onMouseoverListener);
    document.body.removeEventListener("mouseout", this.onMouseoutListener);
    document.body.removeEventListener("click", this.onClickListener);
  }

  onMouseoverListener(ev) {
    const isCursorOnText = ev => {
      const target = ev.target;
      if (target === document.body) return false;
      const targetRect = target.getBoundingClientRect();
      if (
        targetRect !== document.body.clientWidth &&
        (targetRect.right > ev.pagetX || target.top > ev.pageY)
      )
        return true;
      return false;
    };
    if (!this.options.stopScrollingOnHover) return;
    this.isCursorOnText = isCursorOnText();
  }

  onMouseoutListener() {
    this.isCursorOnText = false;
  }

  onClickListener(ev) {
    if (this.options.stopScrollingByClick.value == true) {
      this.stop();
      this.onStopListener();
    }
  }

  setOnStopListener(l) {
    this.onStopListener = l;
  }
}

export default AutoScroller;
