import { SpeedParser } from './index';
import { loadOptionItems } from '../options';
import { isValidTimerId, INVALID_TIMER_ID } from '../utils';

const DELAY_TIME_TO_ACTIVE = 30; // mili

class AutoScroller {
  constructor() {
    this.intervalId = -1;
    this.scrollingElement = null;
    this.scrollingStep = -1;
    this.scrollingInterval = -1;
    this.cursorOnText = false;
    this.userScrolling = false;
    this.userScrollingTimerId = -1;
    this.onStopListener = null;
    this.parser = null;
    this.options = null;

    this.onMouseoverListener = this.onMouseoverListener.bind(this);
    this.onMouseoutListener = this.onMouseoutListener.bind(this);
    this.onWheelListener = this.onWheelListener.bind(this);
    this.onClickListener = this.onClickListener.bind(this);
    this.onOptionLoadListener = this.onOptionLoadListener.bind(this);
    this.onOptionChangeListener = this.onOptionChangeListener.bind(this);
  }

  init() {
    this.parser = new SpeedParser();
    this.options = this.initLoadOptionItems(loadOptionItems());
  }

  initLoadOptionItems(options) {
    const map = {};
    for (const key of Object.keys(options)) {
      const opt = options[key];
      opt.addOnLoadListener(this.onOptionLoadListener);
      opt.addOnChangeListener(this.onOptionChangeListener);
      opt.init();
      map[key] = opt;
    }
    return map;
  }

  onOptionLoadListener() {} // nothing to do

  onOptionChangeListener() {} // nothing to do

  isEnabledStopWhenBottomOfWindow() {
    return this.options.stopWhenBottomOfWindow.value;
  }

  start(speed) {
    this.scrollingElement = this.getScrollingElement();
    this.setScrollingSpeed(speed);
    this.addUserActionListeners();
    this.setScrolling();
    return this;
  }

  setScrolling() {
    this.intervalId = window.setInterval(
      this.scroll.bind(this),
      this.scrollingInterval
    );
  }

  scroll() {
    if (this.isEnabledStopWhenBottomOfWindow() && this.isBottomOfWindow())
      return this.stop(true);
    if (this.isUserScrolling()) return;
    if (this.isEnabledStopScrollingOnHover() && this.isCursorOnText()) return;
    this._oneScroll();
  }

  _oneScroll() {
    this.scrollingElement.scrollBy(0, this.scrollingStep);
  }

  isCursorOnText() {
    return this.cursorOnText;
  }

  stop(isCallListener = false) {
    this.removeUserActionListeners();
    this.clearScrolling();
    if (isCallListener) this.onStopListener();
    return this;
  }

  clearScrolling() {
    window.clearInterval(this.intervalId);
  }

  setScrollingSpeed(speed) {
    const { step, interval } = this.parser.parse(speed);
    this.scrollingStep = step;
    this.scrollingInterval = interval;
  }

  getScrollingElement() {
    return document.scrollingElement
      ? document.scrollingElement
      : document.documentElement;
  }

  addUserActionListeners() {
    document.body.addEventListener('mouseover', this.onMouseoverListener);
    document.body.addEventListener('mouseout', this.onMouseoutListener);
    document.body.addEventListener('wheel', this.onWheelListener);
    document.body.addEventListener('click', this.onClickListener);
  }

  removeUserActionListeners() {
    document.body.removeEventListener('mouseover', this.onMouseoverListener);
    document.body.removeEventListener('mouseout', this.onMouseoutListener);
    document.body.removeEventListener('wheel', this.onWheelListener);
    document.body.removeEventListener('click', this.onClickListener);
  }

  isEnabledStopScrollingOnHover() {
    return this.options.stopScrollingOnHover.value;
  }

  onMouseoverListener(ev) {
    const isCursorOnTextFunc = ev => {
      const target = ev.target;
      if (target === document.body) return false;
      const targetRect = target.getBoundingClientRect();
      if (
        targetRect.width !== document.body.clientWidth &&
        (targetRect.right > ev.pageX || targetRect.top > ev.pageY)
      )
        return true;
      return false;
    };
    if (this.isEnabledStopScrollingOnHover()) return;
    this.cursorOnText = isCursorOnTextFunc(ev);
  }

  onMouseoutListener() {
    this.cursorOnText = false;
  }

  onWheelListener(ev) {
    this.userScrolling = true;
    const timerId = this.userScrollingTimerId;
    if (isValidTimerId(timerId)) clearTimeout(timerId);
    this.userScrollingTimerId = setTimeout(() => {
      this.userScrolling = false;
      this.userScrollingTimerId = INVALID_TIMER_ID;
    }, DELAY_TIME_TO_ACTIVE);
  }

  isUserScrolling() {
    return this.userScrolling;
  }

  onClickListener(ev) {
    if (this.options.stopScrollingByClick.value == true) {
      this.stop(true);
    }
  }

  setOnStopListener(listener) {
    this.onStopListener = listener;
  }

  isBottomOfWindow() {
    return window.scrollY === window.scrollMaxY;
  }
}

export default AutoScroller;
