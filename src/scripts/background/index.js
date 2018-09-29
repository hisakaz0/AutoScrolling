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
const DEFAULT_DOUBLE_CLICK_TIMER = {
  interval: DEFAULT_INTERVAL_DOUBLE_CLICK,
  timerId: -1,
  isWaiting: false
};
const DEFAULT_CONTENT_SCRIPT_STATE = {
  tabId: -1,
  windowId: -1,
  isScrolling: false,
  isModalOpened: false
};

class BackgroundScript {
  constructor() {
    this.doubleClickTimer = Object.assign({}, DEFAULT_DOUBLE_CLICK_TIMER);
    this.contentScriptState = Object.assign({}, DEFAULT_CONTENT_SCRIPT_STATE);
  }

  init() {
    addOnBrowserActionClickListener(this.onBrowserActionClickListener);
    addOnTabActivatedListener(this.onTabActivatedListener);
  }

  onMessageListener(message, tab, sendResponse) {
    switch (message[ACTION_KEY]) {
      case ACTION_STOP_SCROLLING:
        this.managedState.tabId = -1;
        this.managedState.isScrolling = false;
        break;
      case ACTION_UPDATE_COMMAND:
        updateCommand(message[KEY_COMMAND]);
        break;
    }
  }

  onBrowserActionClickListener(tab) {
    if (!this.isWaitingDoubleClick()) return this.setDoubleClickTimer(tab);
    this.clearDoubleClickTimer();
    this.doubleClickAction(tab);
  }

  onTabActivatedListener(tab) {
    sendMessageToTab(this.managedState.tabId, MESSAGE_STOP_SCROLLING);
  }

  isWaitingDoubleClick() {
    return this.doubleClickTimer.isWaiting;
  }

  setDoubleClickTimer(tab) {
    this.doubleClickTimer.timerId = setTimeout(() => {
      this.clearDoubleClickTimer();
      this.singleClickAction(tab);
    }, this.doubleClickTimer.interval);
    this.doubleClickTimer.isWaiting = true;
  }

  clearDoubleClickTimer() {
    clearTimeout(this.doubleClickTimer.timerId);
    this.doubleClickTimer.isWaiting = false;
  }

  singleClickAction(tab) {
    const newScrollingState = !this.managedState.isScrolling;
    sendMessageToTab(tab.id, _getScrollingMessage(newScrollingState));
    this.managedState.tabId = tab.id;
    this.managedState.windowId = tab.windowId;
    this.managedState.isScrolling = newScrollingState;
  }

  doubleClickAction(tab) {
    sendMessageToTab(tab.id, MESSAGE_OPEN_MODAL);
    this.managedState.isModalOpened = true;
  }

  _getScrollingMessage(state) {
    if (state) return MESSAGE_START_SCROLLING;
    return MESSAGE_STOP_SCROLLING;
  }
}

const script = new BackgroundScript();
script.init();
