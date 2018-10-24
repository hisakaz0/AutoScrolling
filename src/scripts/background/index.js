import {
  addOnMessageListener,
  updateCommand,
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnClickListener as addOnBrowserActionClickListener,
  addOnCreatedListener as addOnWindowCreatedListener
} from "../../modules/browser";
import {
  KEY_ACTION,
  KEY_COMMAND,
  ACTION_OPEN_MODAL,
  ACTION_CLOSE_MODAL,
  ACTION_START_SCROLLING,
  ACTION_STOP_SCROLLING,
  MESSAGE_OPEN_MODAL,
  MESSAGE_CLOSE_MODAL,
  MESSAGE_START_SCROLLING,
  MESSAGE_STOP_SCROLLING,
  MESSAGE_UPDATE_COMMAND
} from "../../modules/messaging";

const DEFAULT_INTERVAL_DOUBLE_CLICK = 500; // mili second
const UNINIT_TAB_ID = -1;
const UNINIT_WINDOW_ID = -1;
const DEFAULT_DOUBLE_CLICK_TIMER = {
  interval: DEFAULT_INTERVAL_DOUBLE_CLICK,
  timerId: -1,
  isWaiting: false
};
const DEFAULT_TARGET_TAB = {
  tabId: UNINIT_TAB_ID,
  windowId: UNINIT_WINDOW_ID,
  isScrolling: false,
  stopOnTabChange: false,
  isModalOpened: false
};
const DEFAULT_FOCUS_TAB = {
  tabId: UNINIT_TAB_ID,
  windowId: UNINIT_WINDOW_ID
};

const State = {
  STOP_OR_CLOSE: 0,
  SCROLLING: 1,
  MODAL_OPENED: 2
};

const Event = {
  SINGLE_CLICK: 0,
  DOUBLE_CLICK: 1,
  TAB_CHANGED: 2,
  STOP_MESSAGE_FROM_CONTENT: 3
};

// 複数windowでのscrollingは今後実装
class BackgroundScript {
  constructor() {
    this.doubleClickTimer = Object.assign({}, DEFAULT_DOUBLE_CLICK_TIMER);
    this.targetTab = Object.assign({}, DEFAULT_TARGET_TAB);
    this.focusTab = Object.assign({}, DEFAULT_FOCUS_TAB);
    this.state = State.STOP_OR_CLOSE;

    this.onBrowserActionClickListener = this.onBrowserActionClickListener.bind(
      this
    );
    this.onTabActivatedListener = this.onTabActivatedListener.bind(this);
  }

  init() {
    addOnBrowserActionClickListener(this.onBrowserActionClickListener);
    addOnTabActivatedListener(this.onTabActivatedListener);
  }

  onMessageListener(message, tab, sendResponse) {
    switch (message[ACTION_KEY]) {
      case ACTION_STOP_SCROLLING:
        this.onReceiveStopMessage();
        break;
      case ACTION_UPDATE_COMMAND:
        updateCommand(message[KEY_COMMAND]);
        break;
    }
  }

  resetTargetTab() {
    this.targetTab = Object.assign(this.targetTab, {
      tabId: UNINIT_TAB_ID,
      windowId: UNINIT_WINDOW_ID,
      isScrolling: false
    });
  }

  onBrowserActionClickListener(tab) {
    if (!this.isWaitingDoubleClick()) return this.setDoubleClickTimer();
    this.clearDoubleClickTimer();
    this.onDoubleClickEvent();
  }

  onTabActivatedListener(tab) {
    this._setFocusTab(tab);
    this.onTabChangedEvent();
  }

  _setFocusTab(tab) {
    this.focusTab = { tabId: tab.tabId, windowId: tab.windowId };
  }

  isWaitingDoubleClick() {
    return this.doubleClickTimer.isWaiting;
  }

  setDoubleClickTimer(tab) {
    this.doubleClickTimer.timerId = setTimeout(() => {
      this.clearDoubleClickTimer();
      this.onSingleClickEvent();
    }, this.doubleClickTimer.interval);
    this.doubleClickTimer.isWaiting = true;
  }

  clearDoubleClickTimer() {
    clearTimeout(this.doubleClickTimer.timerId);
    this.doubleClickTimer.isWaiting = false;
  }

  // begin: event area
  onSingleClickEvent() {
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        this.startScrollingAction();
        this.state = State.SCROLLING;
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction();
        this.state = State.STOP_OR_CLOSE;
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction();
        this.state = State.STOP_OR_CLOSE;
        break;
    }
  }

  onDoubleClickEvent(tab) {
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        this.openModalAction();
        this.state = State.MODAL_OPENED;
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction();
        this.state = State.STOP_OR_CLOSE;
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction();
        this.state = State.STOP_OR_CLOSE;
        break;
    }
  }

  onTabChangedEvent() {
    switch (this.state) {
      case State.SCROLLING:
        if (!needToStopScrollingOnTabChanged()) break;
        this.stopScrollingAction(false);
        this.state = State.STOP_OR_CLOSE;
        break;
      case State.STOP_OR_CLOSE:
        if (!this.isEqualTargetToFocus()) break;
        this.startScrollingAction();
      default:
        break;
    }
  }

  onReceiveStopMessage() {
    switch (this.state) {
      case State.SCROLLING:
      case State.STOP_OR_CLOSE:
      case State.MODAL_OPENED:
        this.stopScrollingAction();
        this.state = State.STOP_OR_CLOSE;
        break;
    }
  }
  // end: event area

  needToStopScrollingOnTabChanged() {
    if (
      this.targetTab.isScrolling &&
      this.targetTab.tabId !== this.focusTab.tabId &&
      this.targetTab.windowId === this.focusTab.windowId
    )
      return true;
    return false;
  }

  isEqualTargetToFocus() {
    if (
      this.targetTab.tabId === this.focusTab.tabId &&
      this.targetTab.windowId === this.focusTab.windowId
    )
      return true;
    return false;
  }

  // begin: action area
  startScrollingAction() {
    this.targetTab = Object.assign(this.targetTab, {
      tabId: this.focusTab.tabId,
      windowId: this.focusTab.windowId,
      isScrolling: true
    });
    sendMessageToTab(this.targetTab.tabId, MESSAGE_START_SCROLLING);
  }

  stopScrollingAction(isResetTarget = true) {
    sendMessageToTab(this.targetTab.tabId, MESSAGE_STOP_SCROLLING);
    if (!isResetTarget) return;
    this.targetTab = Object.assign(this.targetTab, {
      tabId: UNINIT_TAB_ID,
      windowId: UNINIT_WINDOW_ID,
      isScrolling: false
    });
  }

  openModalAction() {
    this.targetTab = Object.assign(this.targetTab, {
      tarId: this.focusTab.tabId,
      windowId: this.focusTab.windowId,
      isModalOpened: true
    });
    sendMessageToTab(this.targetTab.tabId, MESSAGE_OPEN_MODAL);
  }

  closeModalAction() {
    sendMessageToTab(this.targetTab.tabId, MESSAGE_CLOSE_MODAL);
    this.targetTab = Object.assign(this.targetTab, {
      tabId: UNINIT_TAB_ID,
      windowId: UNINIT_WINDOW_ID,
      isModalOpened: false
    });
  }
  // end: action area

  _getScrollingMessage(state) {
    if (state) return MESSAGE_START_SCROLLING;
    return MESSAGE_STOP_SCROLLING;
  }
}

const script = new BackgroundScript();
script.init();
