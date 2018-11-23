import parseSpeed from './speed-parser';
import { loadOptionItems, initOptionItems } from '../options';
import { isValidTimerId, INVALID_TIMER_ID } from '../utils';

const DELAY_TIME_TO_ACTIVE = 50; // mili

const isBottomOfWindow = () => window.scrollY === window.scrollMaxY;

const getScrollingElement = () => (document.scrollingElement
  ? document.scrollingElement
  : document.documentElement);

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
    this.parse = null;
    this.options = null;

    this.onMouseoverListener = this.onMouseoverListener.bind(this);
    this.onMouseoutListener = this.onMouseoutListener.bind(this);
    this.onWheelListener = this.onWheelListener.bind(this);
    this.onClickListener = this.onClickListener.bind(this);
  }

  init() {
    this.parse = parseSpeed;
    this.options = initOptionItems(loadOptionItems());
  }

  isEnabledStopWhenBottomOfWindow() {
    return this.options.stopWhenBottomOfWindow.value;
  }

  start(speed) {
    this.scrollingElement = getScrollingElement();
    this.setScrollingSpeed(speed);
    this.addUserActionListeners();
    this.setScrolling();
    return this;
  }

  setScrolling() {
    this.intervalId = window.setInterval(
      this.scroll.bind(this),
      this.scrollingInterval,
    );
  }

  scroll() {
    if (this.isEnabledStopWhenBottomOfWindow() && isBottomOfWindow()) return this.stop(true);
    if (this.isUserScrolling()) return this;
    if (this.isEnabledStopScrollingOnHover() && this.isCursorOnText()) return this;
    return this.oneScroll();
  }

  oneScroll() {
    this.scrollingElement.scrollBy(0, this.scrollingStep);
    return this;
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
    const { step, interval } = this.parse(speed);
    this.scrollingStep = step;
    this.scrollingInterval = interval;
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

  onMouseoverListener(event) {
    const isCursorOnTextFunc = (ev) => {
      const { target } = ev;
      if (target === document.body) return false;
      const rect = target.getBoundingClientRect();
      return (
        rect.width !== document.body.clientWidth
        && (rect.right > ev.pageX || rect.top > ev.pageY)
      );
    };
    if (!this.isEnabledStopScrollingOnHover()) return;
    this.cursorOnText = isCursorOnTextFunc(event);
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
    if (this.options.stopScrollingByClick.value === true) {
      this.stop(true);
    }
  }

  setOnStopListener(listener) {
    this.onStopListener = listener;
  }
}

export default AutoScroller;
