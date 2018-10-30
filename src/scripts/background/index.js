import {
  addOnMessageListener,
  updateCommand,
  addOnCommandListener,
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabAttachedListener,
  addOnTabUpdatedListener,
  getActivatedTabs,
  getTab,
  isValidTabId,
  addOnClickListener as addOnBrowserActionClickListener,
  addOnWindowFocusChangedListener,
  isValidWindowId
} from "../../modules/browser";
import {
  KEY_ACTION,
  KEY_COMMAND,
  ACTION_OPEN_MODAL,
  ACTION_CLOSE_MODAL,
  ACTION_START_SCROLLING,
  ACTION_STOP_SCROLLING,
  ACTION_INIT_CONTENT_SCRIPT,
  ACTION_UPDATE_COMMAND,
  MESSAGE_OPEN_MODAL,
  MESSAGE_CLOSE_MODAL,
  MESSAGE_START_SCROLLING,
  MESSAGE_STOP_SCROLLING,
  MESSAGE_UPDATE_COMMAND
} from "../../modules/messaging";
import { isSystemProtocol } from "../../modules/utils";

import appConst from "../../appConst.json";
const appOpts = appConst.options;

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
    this.onWindowFocusChangedListener = this.onWindowFocusChangedListener.bind(
      this
    );
    this.onTabUpdatedListener = this.onTabUpdatedListener.bind(this);
    this.onMessageListener = this.onMessageListener.bind(this);
    this.onCommandListener = this.onCommandListener.bind(this);
  }

  init() {
    addOnBrowserActionClickListener(this.onBrowserActionClickListener);
    addOnTabActivatedListener(this.onTabActivatedListener);
    addOnWindowFocusChangedListener(this.onWindowFocusChangedListener);
    addOnTabUpdatedListener(this.onTabUpdatedListener);
    addOnMessageListener(this.onMessageListener);
    addOnCommandListener(this.onCommandListener);
    this.initFocusTab();
  }

  initFocusTab() {
    this.setFocusTabFromActivatedTab();
  }

  setFocusTabFromActivatedTab(windowId = null) {
    getActivatedTabs().then(tabs => {
      let tab = tabs[0];
      if (isValidWindowId(windowId)) {
        tab = tabs.filter(tab => {
          return tab.windowId === windowId;
        })[0];
      }
      this._setFocusTab({
        tabId: tab.id,
        windowId: tab.windowId
      });
    });
  }

  onMessageListener(message, tab, sendResponse) {
    switch (message[KEY_ACTION]) {
      case ACTION_STOP_SCROLLING:
        this.onReceiveStopMessage();
        break;
      case ACTION_CLOSE_MODAL:
        this.onReceiveCloseMessage();
        break;
      case ACTION_UPDATE_COMMAND:
        updateCommand(message[KEY_COMMAND]);
        break;
      case ACTION_INIT_CONTENT_SCRIPT:
        this.onRecieveInitContentScript();
        break;
    }
  }

  onBrowserActionClickListener(tab) {
    if (!this.isWaitingDoubleClick()) return this.setDoubleClickTimer();
    this.clearDoubleClickTimer();
    this.onDoubleClickEvent();
  }

  onTabActivatedListener(activeInfo) {
    this._setFocusTab(activeInfo);
    this.onTabChangedEvent();
  }

  onWindowFocusChangedListener(windowId) {
    this.setFocusTabFromActivatedTab(windowId);
    this.onTabChangedEvent();
  }

  onTabUpdatedListener(tab) {
    if (
      this.targetTab.tabId === tab.id &&
      this.targetTab.windowId === tab.windowId
    ) {
      this.resetTargetTab();
    }
  }

  resetTargetTab() {
    this.targetTab = Object.assign(this.targetTab, {
      isScrolling: false,
      isModalOpened: false
    });
    this.state = State.STOP_OR_CLOSE;
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
        this.startScrollingAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.SCROLLING;
        });
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
    }
  }

  onDoubleClickEvent() {
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        this.openModalAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.MODAL_OPENED;
        });
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
    }
  }

  onTabChangedEvent() {
    switch (this.state) {
      case State.SCROLLING:
        if (!this.needToStopScrollingOnTabChanged()) break;
        this.stopScrollingAction(false).then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
      case State.MODAL_OPENED:
        if (!this.needToCloseModalOnTabChanged()) break;
        this.closeModalAction().then(isSuccess => {
          if (!isSuccess) return;
          this.state = State.STOP_OR_CLOSE;
        });
        break;
      case State.STOP_OR_CLOSE:
      default:
        break;
    }
  }

  onCommandListener(name) {
    switch (name) {
      case appOpts.keybindSingleClick.commandName:
        this.onSingleClickEvent();
        break;
      default:
        break;
    }
  }
  // end: event area

  onRecieveInitContentScript() {
    if (!this.isEqualTargetToFocus()) return;
    this.targetTab = Object.assign(this.targetTab, {
      isScrolling: false,
      isModalOpened: false
    });
    this.state = State.STOP_OR_CLOSE;
  }

  onReceiveStopMessage() {
    this.targetTab = Object.assign(this.targetTab, {
      tabId: UNINIT_TAB_ID,
      windowId: UNINIT_WINDOW_ID,
      isScrolling: false
    });
    this.state = State.STOP_OR_CLOSE;
  }

  onReceiveCloseMessage() {
    this.targetTab = Object.assign(this.targetTab, {
      tabId: UNINIT_TAB_ID,
      windowId: UNINIT_WINDOW_ID,
      isModalOpened: false
    });
    this.state = State.STOP_OR_CLOSE;
  }

  needToStopScrollingOnTabChanged() {
    if (
      this.targetTab.isScrolling &&
      this.targetTab.tabId !== this.focusTab.tabId &&
      this.targetTab.windowId === this.focusTab.windowId
    )
      return true;
    return false;
  }

  needToCloseModalOnTabChanged() {
    if (
      this.targetTab.isModalOpened &&
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

  beforeAction(tabId, callback) {
    const falsePromise = new Promise(resolve => {
      resolve(false);
    });
    if (!isValidTabId(this.focusTab.tabId)) return falsePromise;
    return getTab(tabId).then(tab => {
      if (isSystemProtocol(tab.url)) return falsePromise;
      return callback();
    });
  }

  // begin: action area
  startScrollingAction() {
    const action = () => {
      this.targetTab = Object.assign(this.targetTab, {
        tabId: this.focusTab.tabId,
        windowId: this.focusTab.windowId,
        isScrolling: true
      });
      sendMessageToTab(this.targetTab.tabId, MESSAGE_START_SCROLLING);
      return new Promise(resolve => {
        resolve(true);
      });
    };
    action.bind(this);

    return this.beforeAction(this.focusTab.tabId, action);
  }

  stopScrollingAction(isResetTarget = true) {
    const action = () => {
      sendMessageToTab(this.targetTab.tabId, MESSAGE_STOP_SCROLLING);
      if (!isResetTarget) return;
      this.targetTab = Object.assign(this.targetTab, {
        tabId: UNINIT_TAB_ID,
        windowId: UNINIT_WINDOW_ID,
        isScrolling: false
      });
      return new Promise(resolve => {
        resolve(true);
      });
    };
    action.bind(this);

    return this.beforeAction(this.targetTab.tabId, action);
  }

  openModalAction() {
    const action = () => {
      this.targetTab = Object.assign(this.targetTab, {
        tabId: this.focusTab.tabId,
        windowId: this.focusTab.windowId,
        isModalOpened: true
      });
      sendMessageToTab(this.targetTab.tabId, MESSAGE_OPEN_MODAL);
      return new Promise(resolve => {
        resolve(true);
      });
    };
    action.bind(this);

    return this.beforeAction(this.focusTab.tabId, action);
  }

  closeModalAction() {
    const action = () => {
      sendMessageToTab(this.targetTab.tabId, MESSAGE_CLOSE_MODAL);
      this.targetTab = Object.assign(this.targetTab, {
        tabId: UNINIT_TAB_ID,
        windowId: UNINIT_WINDOW_ID,
        isModalOpened: false
      });
      return new Promise(resolve => {
        resolve(true);
      });
    };
    action.bind(this);

    return this.beforeAction(this.targetTab.tabId, action);
  }
  // end: action area

  _getScrollingMessage(state) {
    if (state) return MESSAGE_START_SCROLLING;
    return MESSAGE_STOP_SCROLLING;
  }
}

const script = new BackgroundScript();
script.init();
