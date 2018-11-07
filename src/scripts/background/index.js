import {
  addOnMessageListener,
  updateCommand,
  addOnCommandListener,
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabUpdatedListener,
  addOnTabRemovedListener,
  getActivatedTabs,
  getTab,
  isValidTabId,
  addOnBrowserActionClickListener,
  setBrowserActionTitle,
  setBrowserActionIcon,
  addOnWindowFocusChangedListener,
  isValidWindowId
} from '../../modules/browser';
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
} from '../../modules/messaging';
import { OptionItem } from '../../modules/options';
import { logger, isSystemProtocol } from '../../modules/utils';
import { ContextMenuScript } from '../context-menu';
import { State } from './state';
import { EventType } from './event';

import appConst from '../../appConst.json';
const appOpts = appConst.options;
const appBrowseActs = appConst.browserAction;

// NOTE: use browser api out of module
const TAB_ID_NONE = browser.tabs.TAB_ID_NONE;
const WINDOW_ID_NONE = browser.windows.WINDOW_ID_NONE;

const DEFAULT_INTERVAL_DOUBLE_CLICK = 500; // mili second
const DEFAULT_DOUBLE_CLICK_TIMER = {
  interval: DEFAULT_INTERVAL_DOUBLE_CLICK,
  timerId: -1,
  isWaiting: false
};
const DEFAULT_TARGET_TAB = {
  tabId: TAB_ID_NONE,
  windowId: WINDOW_ID_NONE,
  isScrolling: false,
  isModalOpened: false,
  firedFromEvent: EventType.EVENT_ID_NONE
};
const DEFAULT_FOCUS_TAB = {
  tabId: TAB_ID_NONE,
  windowId: WINDOW_ID_NONE
};

class BackgroundScript {
  constructor() {
    this.doubleClickTimer = Object.assign({}, DEFAULT_DOUBLE_CLICK_TIMER);
    this.targetTab = Object.assign({}, DEFAULT_TARGET_TAB);
    this.prevTargetTab = Object.assign({}, this.targetTab);
    this.focusTab = Object.assign({}, DEFAULT_FOCUS_TAB);
    this.setState(State.STOP_OR_CLOSE);
    // TODO: maybe need lock mecanizum

    this.onBrowserActionClickListener = this.onBrowserActionClickListener.bind(
      this
    );
    this.onTabActivatedListener = this.onTabActivatedListener.bind(this);
    this.onWindowFocusChangedListener = this.onWindowFocusChangedListener.bind(
      this
    );
    this.onTabUpdatedListener = this.onTabUpdatedListener.bind(this);
    this.onTabRemovedListener = this.onTabRemovedListener.bind(this);
    this.onMessageListener = this.onMessageListener.bind(this);
    this.onCommandListener = this.onCommandListener.bind(this);
  }

  init() {
    this.initListeners();
    this.initFocusTab();
    this.initLoadOptions();
    this.updateBrowerAction(this.state);
  }

  initFocusTab() {
    this.setFocusTabFromActivateWindow();
  }

  initListeners() {
    addOnBrowserActionClickListener(this.onBrowserActionClickListener);
    addOnTabActivatedListener(this.onTabActivatedListener);
    addOnWindowFocusChangedListener(this.onWindowFocusChangedListener);
    addOnTabUpdatedListener(this.onTabUpdatedListener);
    addOnTabRemovedListener(this.onTabRemovedListener);
    addOnMessageListener(this.onMessageListener);
    addOnCommandListener(this.onCommandListener);
  }

  initLoadOptions() {
    this.options = {
      stopScrollingOnFocusOut: new OptionItem(
        'stopScrollingOnFocusOut',
        appOpts.stopScrollingOnFocusOut.value
      ),
      disableDoubleClick: new OptionItem(
        'disableDoubleClick',
        appOpts.disableDoubleClick.value
      ),
      restoreScrollingFromSwitchBack: new OptionItem(
        'restoreScrollingFromSwitchBack',
        appOpts.restoreScrollingFromSwitchBack
      )
    };
    Object.entries(this.options).map(entry => {
      const [key, value] = entry;
      value.init();
    });
  }

  isStopScrollingOnFocusOut() {
    return this.options.stopScrollingOnFocusOut.value;
  }

  isDisableDoubleClick() {
    return this.options.disableDoubleClick.value;
  }

  isRestoreScrollingFromSwitchBack() {
    return this.options.restoreScrollingFromSwitchBack.value;
  }

  setFocusTabFromActivateWindow(windowId = WINDOW_ID_NONE) {
    const getFocusTab = (windowId, tabs) => {
      if (windowId === WINDOW_ID_NONE) {
        return DEFAULT_FOCUS_TAB;
      }
      const filtered = tabs.filter(tab => {
        return tab.windowId === windowId;
      });
      if (filtered.length === 0) {
        const tab = tabs[0];
        return { tabId: tab.id, windowId: tab.windowId };
      }
      const focusTab = filtered[0];
      return { tabId: focusTab.id, windowId: focusTab.windowId };
    };
    return getActivatedTabs().then(tabs => {
      const tab = this._setFocusTab(getFocusTab(windowId, tabs));
      return Promise.resolve(tab);
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
    if (this.isDisableDoubleClick()) return this.onSingleClickEvent();
    if (!this.isWaitingDoubleClick()) return this.setDoubleClickTimer();
    this.clearDoubleClickTimer();
    this.onDoubleClickEvent();
  }

  onTabActivatedListener(activeInfo) {
    this._setFocusTab(activeInfo);
    this.onActivateChanged(EventType.TAB_CHANGED);
  }

  onWindowFocusChangedListener(windowId) {
    this.setFocusTabFromActivateWindow(windowId).then(tab => {
      this.onActivateChanged(EventType.WINDOW_CHANGED);
    });
  }

  onTabUpdatedListener(tab) {
    if (this.targetTab.tabId === tab.id) {
      this.resetTargetTab(EventType.TAB_UPDATED);
    }
  }

  onTabRemovedListener(tabId) {
    if (this.targetTab.tabId === tabId) {
      this.resetTargetTab(EventType.TAB_REMOVED);
    }
  }

  resetTargetTab(eventType) {
    this.targetTab = Object.assign(this.targetTab, {
      isScrolling: false,
      isModalOpened: false,
      firedFromEvent: eventType
    });
    this.setState(State.STOP_OR_CLOSE);
  }

  setTargetTab(props) {
    this.prevTargetTab = Object.assign(this.prevTargetTab, this.targetTab);
    this.targetTab = Object.assign(this.targetTab, props);
  }

  _setFocusTab(tab) {
    this.focusTab = { tabId: tab.tabId, windowId: tab.windowId };
    return this.focusTab;
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

  setState(newState) {
    const prevState = this.state;
    this.state = newState;
    this.onUpdateState(prevState, newState);
  }

  onUpdateState(prevState, newState) {
    this.updateBrowerAction(newState);
  }

  updateBrowerAction(state) {
    const getInfo = state => {
      switch (state) {
        case State.STOP_OR_CLOSE:
          return appBrowseActs.stopOrClose;
        case State.SCROLLING:
          return appBrowseActs.scrolling;
        case State.MODAL_OPENED:
          return appBrowseActs.modalOpened;
      }
    };
    const { title, path } = getInfo(state);
    return Promise.all([
      setBrowserActionTitle(title),
      setBrowserActionIcon(path)
    ]);
  }

  // begin: event area
  onSingleClickEvent() {
    const eventType = EventType.SINGLE_CLICK;
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        this.startScrollingAction(eventType);
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction(eventType);
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction(eventType);
        break;
    }
  }

  onDoubleClickEvent() {
    const eventType = EventType.DOUBLE_CLICK;
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        this.openModalAction(eventType);
        break;
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        this.closeModalAction(eventType);
        break;
      case State.SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        this.stopScrollingAction(eventType);
        break;
    }
  }

  onActivateChanged(eventType = EventType.TAB_CHANGED) {
    switch (this.state) {
      case State.SCROLLING:
        if (
          this.isStopScrollingOnFocusOut() &&
          this.focusTab.windowId === WINDOW_ID_NONE
        ) {
          this.stopScrollingAction(eventType);
          break;
        }
        if (!this.needToStopScrollingOnTabChanged()) break;
        this.stopScrollingAction(eventType);
        break;
      case State.MODAL_OPENED:
        if (!this.needToCloseModalOnTabChanged()) break;
        this.closeModalAction(eventType);
        break;
      case State.STOP_OR_CLOSE:
        if (
          this.isRestoreScrollingFromSwitchBack() &&
          eventType === EventType.TAB_CHANGED &&
          this.targetTab.firedFromEvent === EventType.TAB_CHANGED &&
          this.prevTargetTab.isScrolling === true &&
          this.prevTargetTab.tabId === this.focusTab.tabId
        ) {
          this.startScrollingAction(eventType);
        }
        break;
      default:
        break;
    }
  }

  onCommandListener(name) {
    switch (name) {
      case appOpts.keybindSingleClick.commandName:
        // this command acts as SINGLE_CLICK
        this.onSingleClickEvent();
        break;
      default:
        break;
    }
  }

  onRecieveInitContentScript() {
    if (!this.isEqualTargetToFocus()) return;
    this.setTargetTab({
      isScrolling: false,
      isModalOpened: false,
      firedFromEvent: EventType.INIT_CONTENT_SCRIPT
    });
    this.setState(State.STOP_OR_CLOSE);
  }

  onReceiveStopMessage() {
    this.setTargetTab({
      tabId: TAB_ID_NONE,
      windowId: WINDOW_ID_NONE,
      isScrolling: false,
      firedFromEvent: EventType.CONTENT_SCRIPT_MESSAGE
    });
    this.setState(State.STOP_OR_CLOSE);
  }

  onReceiveCloseMessage() {
    this.setTargetTab({
      tabId: TAB_ID_NONE,
      windowId: WINDOW_ID_NONE,
      isModalOpened: false,
      firedFromEvent: EventType.CONTENT_SCRIPT_MESSAGE
    });
    this.setState(State.STOP_OR_CLOSE);
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
    if (this.targetTab.tabId === this.focusTab.tabId) return true;
    return false;
  }

  beforeAction(tabId) {
    // if (!isValidTabId(this.focusTab.tabId)) return Promise.reject();
    return getTab(tabId).then(tab => {
      if (isSystemProtocol(tab.url)) return Promise.reject();
      return Promise.resolve();
    });
  }

  // begin: action area
  startScrollingAction(eventType) {
    return this.beforeAction(this.focusTab.tabId)
      .then(() => {
        return sendMessageToTab(this.focusTab.tabId, MESSAGE_START_SCROLLING);
      })
      .then(() => {
        this.setTargetTab({
          tabId: this.focusTab.tabId,
          windowId: this.focusTab.windowId,
          isScrolling: true,
          firedFromEvent: eventType
        });
        this.setState(State.SCROLLING);
      });
  }

  stopScrollingAction(eventType) {
    return this.beforeAction(this.targetTab.tabId)
      .then(() => {
        return sendMessageToTab(this.targetTab.tabId, MESSAGE_STOP_SCROLLING);
      })
      .then(() => {
        this.setTargetTab({
          tabId: TAB_ID_NONE,
          windowId: WINDOW_ID_NONE,
          isScrolling: false,
          firedFromEvent: eventType
        });
        this.setState(State.STOP_OR_CLOSE);
      });
  }

  openModalAction(eventType) {
    return this.beforeAction(this.focusTab.tabId)
      .then(() => {
        return sendMessageToTab(this.focusTab.tabId, MESSAGE_OPEN_MODAL);
      })
      .then(() => {
        this.setTargetTab({
          tabId: this.focusTab.tabId,
          windowId: this.focusTab.windowId,
          isModalOpened: true,
          firedFromEvent: eventType
        });
        this.setState(State.MODAL_OPENED);
      });
  }

  closeModalAction(eventType) {
    return this.beforeAction(this.targetTab.tabId)
      .then(() => {
        return sendMessageToTab(this.targetTab.tabId, MESSAGE_CLOSE_MODAL);
      })
      .then(() => {
        this.setTargetTab({
          tabId: TAB_ID_NONE,
          windowId: WINDOW_ID_NONE,
          isModalOpened: false,
          firedFromEvent: eventType
        });
        this.setState(State.STOP_OR_CLOSE);
      });
  }
  // end: action area

  _getScrollingMessage(state) {
    if (state) return MESSAGE_START_SCROLLING;
    return MESSAGE_STOP_SCROLLING;
  }
}

const backgroundScript = new BackgroundScript();
backgroundScript.init();
const contextMenuScript = new ContextMenuScript(backgroundScript);
contextMenuScript.init();
