import {
  addOnMessageListener,
  updateCommand,
  addOnCommandListener,
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabUpdatedListener,
  addOnTabRemovedListener,
  getActivatedTabs,
  addOnBrowserActionClickListener,
  setBrowserActionTitle,
  setBrowserActionIcon,
  addOnWindowFocusChangedListener,
} from '../../modules/browser';
import api from '../../modules/browser/api';
import {
  KEY_ACTION,
  KEY_COMMAND,
  ACTION_CLOSE_MODAL,
  ACTION_STOP_SCROLLING,
  ACTION_INIT_CONTENT_SCRIPT,
  ACTION_UPDATE_COMMAND,
  MESSAGE_OPEN_MODAL,
  MESSAGE_CLOSE_MODAL,
  MESSAGE_START_SCROLLING,
  MESSAGE_STOP_SCROLLING,
  MESSAGE_CHANGE_SPEED,
  addData as addDataToMessage,
} from '../../modules/messaging';
import { loadOptionItems, initOptionItems } from '../../modules/options';
import { logger, isNotSystemTabWith } from '../../modules/utils';
import ContextMenuScript from '../context-menu';
import State from './state';
import EventType from './event';

import appConst from '../../appConst.json';

const appOpts = appConst.options;
const appBrowseActs = appConst.browserAction;

// NOTE: use browser api out of module
const { TAB_ID_NONE } = api.tabs;
const { WINDOW_ID_NONE } = api.windows;

const DEFAULT_INTERVAL_DOUBLE_CLICK = 500; // mili second
const DEFAULT_DOUBLE_CLICK_TIMER = {
  interval: DEFAULT_INTERVAL_DOUBLE_CLICK,
  timerId: -1,
  isWaiting: false,
};
const DEFAULT_TARGET_TAB = {
  tabId: TAB_ID_NONE,
  windowId: WINDOW_ID_NONE,
  isScrolling: false,
  isModalOpened: false,
  firedFromEvent: EventType.EVENT_ID_NONE,
};
const DEFAULT_FOCUS_TAB = {
  tabId: TAB_ID_NONE,
  windowId: WINDOW_ID_NONE,
};

class BackgroundScript {
  constructor() {
    this.doubleClickTimer = { ...DEFAULT_DOUBLE_CLICK_TIMER };
    this.targetTab = { ...DEFAULT_TARGET_TAB };
    this.prevTargetTab = { ...this.targetTab };
    this.focusTab = { ...DEFAULT_FOCUS_TAB };
    this.onStateChangeListeners = [];
    this.setState(State.STOP_OR_CLOSE);
    // TODO: maybe need lock mecanizum

    this.onBrowserActionClickListener = this.onBrowserActionClickListener.bind(
      this,
    );
    this.onTabActivatedListener = this.onTabActivatedListener.bind(this);
    this.onWindowFocusChangedListener = this.onWindowFocusChangedListener.bind(
      this,
    );
    this.onTabUpdatedListener = this.onTabUpdatedListener.bind(this);
    this.onTabRemovedListener = this.onTabRemovedListener.bind(this);
    this.onMessageListener = this.onMessageListener.bind(this);
    this.onCommandListener = this.onCommandListener.bind(this);
  }

  init() {
    this.initListeners();
    this.initFocusTab();
    this.updateBrowerAction();

    initOptionItems(loadOptionItems);
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

  isStopScrollingOnFocusOut() {
    return this.options.stopScrollingOnFocusOut.value;
  }

  isDisableDoubleClick() {
    return this.options.disableDoubleClick.value;
  }

  isRestoreScrollingFromSwitchBack() {
    return this.options.restoreScrollingFromSwitchBack.value;
  }

  isEnabledTransmissionScrolling() {
    return this.options.enableTransmissionScrolling.value;
  }

  setFocusTabFromActivateWindow(targetWindowId = WINDOW_ID_NONE) {
    const getFocusTab = (windowId, tabs) => {
      if (windowId === WINDOW_ID_NONE) {
        return DEFAULT_FOCUS_TAB;
      }
      const filtered = tabs.filter(tab => tab.windowId === windowId);
      if (filtered.length === 0) {
        const tab = tabs[0];
        return { tabId: tab.id, windowId: tab.windowId };
      }
      const focusTab = filtered[0];
      return { tabId: focusTab.id, windowId: focusTab.windowId };
    };
    return getActivatedTabs().then(tabs => Promise.resolve(this.setFocusTab(
      getFocusTab(targetWindowId, tabs),
    )));
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
      default:
        logger.error(`Invalid action: ${message[KEY_ACTION]}`);
        break;
    }
  }

  onBrowserActionClickListener(tab) {
    if (this.isDisableDoubleClick()) return this.onSingleClickEvent();
    if (!this.isWaitingDoubleClick()) return this.setDoubleClickTimer();
    return this.clearDoubleClickTimer().onDoubleClickEvent();
  }

  onTabActivatedListener(activeInfo) {
    this.setFocusTab(activeInfo);
    this.onActivateChanged(EventType.TAB_CHANGED);
  }

  onWindowFocusChangedListener(windowId) {
    this.setFocusTabFromActivateWindow(windowId).then(tab => this
      .onActivateChanged(EventType.WINDOW_CHANGED));
  }

  onTabUpdatedListener(tab) {
    if (this.targetTab.tabId === tab.id) {
      this
        .resetTargetTab(EventType.TAB_UPDATED);
    }
  }

  onTabRemovedListener(tabId) {
    if (this.targetTab.tabId === tabId) {
      this
        .resetTargetTab(EventType.TAB_REMOVED);
    }
  }

  resetTargetTab(eventType) {
    this.targetTab = {
      ...this.targetTab,
      isScrolling: false,
      isModalOpened: false,
      firedFromEvent: eventType,
    };
    this.setState(State.STOP_OR_CLOSE);
  }

  setTargetTab(props) {
    this.prevTargetTab = { ...this.prevTargetTab, ...this.targetTab };
    this.targetTab = { ...this.targetTab, ...props };
    return this;
  }

  setFocusTab(tab) {
    this.focusTab = { tabId: tab.tabId, windowId: tab.windowId };
    logger.debug(this.focusTab);
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
    return this;
  }

  clearDoubleClickTimer() {
    clearTimeout(this.doubleClickTimer.timerId);
    this.doubleClickTimer.isWaiting = false;
    return this;
  }

  setState(newState) {
    logger.debug('state', [newState, this.state]);
    const prevState = this.state;
    this.state = newState;
    this.onUpdateState(prevState, newState);
    this.onStateChangeListeners.forEach(func => func(newState));
  }

  addOnStateChangeListener(listener) {
    this.onStateChangeListeners.push(listener.bind(this));
  }

  onUpdateState(prevState, newState) {
    this.updateBrowerAction(newState);
  }

  updateBrowerAction() {
    const getInfo = (currState) => {
      switch (currState) {
        case State.STOP_OR_CLOSE:
          return appBrowseActs.stopOrClose;
        case State.SCROLLING:
        case State.FAST_SCROLLING:
          return appBrowseActs.scrolling;
        case State.MODAL_OPENED:
          return appBrowseActs.modalOpened;
        case State.SLOW_SCROLLING:
        case State.MIDDLE_SCROLLING:
          return appBrowseActs.accelerateScrolling;
        default:
          throw new Error(`Invalid state: ${currState}`);
      }
    };
    const { title, path } = getInfo(this.state);
    return Promise.all([
      setBrowserActionTitle(title),
      setBrowserActionIcon(path),
    ]);
  }

  // begin: event area
  onSingleClickEvent() {
    const eventType = EventType.SINGLE_CLICK;
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        return this.startScrollingAction(eventType);
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        return this.closeModalAction(eventType);
      case State.SCROLLING:
      case State.FAST_SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        return this.stopScrollingAction(eventType);
      case State.SLOW_SCROLLING:
      case State.MIDDLE_SCROLLING:
        return this.accelerateScrollingAction(eventType);
      default:
        throw new Error(`Invalid State: ${this.state}`);
    }
    return Promise.reject();
  }

  onDoubleClickEvent() {
    const eventType = EventType.DOUBLE_CLICK;
    switch (this.state) {
      case State.STOP_OR_CLOSE:
        return this.openModalAction(eventType);
      case State.MODAL_OPENED:
        if (!this.isEqualTargetToFocus()) break;
        return this.closeModalAction(eventType);
      case State.SCROLLING:
      case State.FAST_SCROLLING:
        if (!this.isEqualTargetToFocus()) break;
        return this.stopScrollingAction(eventType);
      case State.SLOW_SCROLLING:
      case State.MIDDLE_SCROLLING:
        return this.accelerateScrollingAction(eventType);
      default:
        throw new Error(`Invalid State: ${this.state}`);
    }
    return Promise.reject();
  }

  onActivateChanged(eventType = EventType.TAB_CHANGED) {
    switch (this.state) {
      case State.SCROLLING:
      case State.SLOW_SCROLLING:
      case State.MIDDLE_SCROLLING:
      case State.FAST_SCROLLING:
        if (
          this.isStopScrollingOnFocusOut()
          && this.focusTab.windowId === WINDOW_ID_NONE
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
          this.isRestoreScrollingFromSwitchBack()
          && eventType === EventType.TAB_CHANGED
          && this.targetTab.firedFromEvent === EventType.TAB_CHANGED
          && this.prevTargetTab.isScrolling === true
          && this.prevTargetTab.tabId === this.focusTab.tabId
        ) {
          this.startScrollingAction(eventType);
        }
        break;
      default:
        throw new Error(`Invalid State: ${this.state}`);
    }
  }

  onCommandListener(name) {
    switch (name) {
      case appOpts.keybindSingleClick.commandName:
        // this command acts as SINGLE_CLICK
        return this.onSingleClickEvent();
      default:
        return Promise.reject();
    }
  }

  onRecieveInitContentScript() {
    if (!this.isEqualTargetToFocus()) return;
    this.setTargetTab({
      isScrolling: false,
      isModalOpened: false,
      firedFromEvent: EventType.INIT_CONTENT_SCRIPT,
    });
    this.setState(State.STOP_OR_CLOSE);
  }

  onReceiveStopMessage() {
    this.setTargetTab({
      tabId: TAB_ID_NONE,
      windowId: WINDOW_ID_NONE,
      isScrolling: false,
      firedFromEvent: EventType.CONTENT_SCRIPT_MESSAGE,
    });
    this.setState(State.STOP_OR_CLOSE);
  }

  onReceiveCloseMessage() {
    this.setTargetTab({
      tabId: TAB_ID_NONE,
      windowId: WINDOW_ID_NONE,
      isModalOpened: false,
      firedFromEvent: EventType.CONTENT_SCRIPT_MESSAGE,
    });
    this.setState(State.STOP_OR_CLOSE);
  }
  // end: event area

  needToStopScrollingOnTabChanged() {
    return (
      this.targetTab.isScrolling
      && this.targetTab.tabId !== this.focusTab.tabId
      && this.targetTab.windowId === this.focusTab.windowId
    );
  }

  needToCloseModalOnTabChanged() {
    return (
      this.targetTab.isModalOpened
      && this.targetTab.tabId !== this.focusTab.tabId
      && this.targetTab.windowId === this.focusTab.windowId
    );
  }

  isEqualTargetToFocus() {
    return this.targetTab.tabId === this.focusTab.tabId;
  }

  getStartScrollingSpeed() {
    if (this.isEnabledTransmissionScrolling()) {
      return this.options.transmissionGearOfSlow.value;
    }
    return this.options.scrollingSpeed.value;
  }

  getNextScrollingSpeed() {
    if (!this.isEnabledTransmissionScrolling()) {
      throw new Error('Invalid call');
    }
    const get = () => {
      switch (this.state) {
        case State.SLOW_SCROLLING:
          return this.options.transmissionGearOfMiddle.value;
        case State.MIDDLE_SCROLLING:
          return this.options.transmissionGearOfFast.value;
        default:
          throw new Error('Invalid state');
      }
    };
    return get();
  }

  getNextScrollingState() {
    if (!this.isEnabledTransmissionScrolling()) {
      throw new Error('Invalid call');
    }
    const get = () => {
      switch (this.state) {
        case State.SLOW_SCROLLING:
          return State.MIDDLE_SCROLLING;
        case State.MIDDLE_SCROLLING:
          return State.FAST_SCROLLING;
        default:
          throw new Error('Invalid state');
      }
    };
    return get();
  }

  // begin: action area
  startScrollingAction(eventType) {
    return isNotSystemTabWith(this.focusTab.tabId)
      .then(() => sendMessageToTab(this.focusTab.tabId,
        addDataToMessage(MESSAGE_START_SCROLLING, {
          scrollingSpeed: this.getStartScrollingSpeed(),
        })))
      .then(() => Promise.resolve(
        this.isEnabledTransmissionScrolling() ? State.SLOW_SCROLLING : State.SCROLLING,
      ))
      .then((state) => {
        this.setTargetTab({
          tabId: this.focusTab.tabId,
          windowId: this.focusTab.windowId,
          isScrolling: true,
          firedFromEvent: eventType,
        });
        this.setState(state);
      });
  }

  stopScrollingAction(eventType) {
    return isNotSystemTabWith(this.targetTab.tabId)
      .then(() => sendMessageToTab(this.targetTab.tabId, MESSAGE_STOP_SCROLLING))
      .then(() => {
        this.setTargetTab({
          tabId: TAB_ID_NONE,
          windowId: WINDOW_ID_NONE,
          isScrolling: false,
          firedFromEvent: eventType,
        });
        this.setState(State.STOP_OR_CLOSE);
      });
  }

  accelerateScrollingAction(eventType) {
    return isNotSystemTabWith(this.targetTab.tabId)
      .then(() => sendMessageToTab(this.targetTab.tabId,
        addDataToMessage(MESSAGE_CHANGE_SPEED, {
          scrollingSpeed: this.getNextScrollingSpeed(),
        })))
      .then(() => this.setState(this.getNextScrollingState()));
  }

  openModalAction(eventType) {
    return isNotSystemTabWith(this.focusTab.tabId)
      .then(() => sendMessageToTab(this.focusTab.tabId, MESSAGE_OPEN_MODAL))
      .then(() => {
        this.setTargetTab({
          tabId: this.focusTab.tabId,
          windowId: this.focusTab.windowId,
          isModalOpened: true,
          firedFromEvent: eventType,
        });
        this.setState(State.MODAL_OPENED);
      });
  }

  closeModalAction(eventType) {
    return isNotSystemTabWith(this.targetTab.tabId)
      .then(() => sendMessageToTab(this.targetTab.tabId, MESSAGE_CLOSE_MODAL))
      .then(() => {
        this.setTargetTab({
          tabId: TAB_ID_NONE,
          windowId: WINDOW_ID_NONE,
          isModalOpened: false,
          firedFromEvent: eventType,
        });
        this.setState(State.STOP_OR_CLOSE);
      });
  }
  // end: action area
}

const backgroundScript = new BackgroundScript();
backgroundScript.init();
const contextMenuScript = new ContextMenuScript(backgroundScript);
contextMenuScript.init();
backgroundScript.addOnStateChangeListener(contextMenuScript.onStateChange);
