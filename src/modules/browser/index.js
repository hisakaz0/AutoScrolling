import {
  sendMessage as sendMessageToTab,
  addOnActivatedListener as addOnTabActivatedListener,
  addOnAttachedListener as addOnTabAttachedListener,
  addOnUpdatedListener as addOnTabUpdatedListener,
  addOnRemovedListener as addOnTabRemovedListener,
  getCurrent as getCurrentTab,
  getActivated as getActivatedTabs,
  get as getTab,
  isValidTabId
} from "./tabs";
import {
  saveItemOnSyncStorage,
  loadItemOnSyncStorage,
  loadAllItemsOnSyncStorage,
  removeItemOnSyncStorage,
  removeAllItemsOnSyncStorage,
  addOnChangeListenerInStorage
} from "./storage";
import {
  updateCommand,
  addOnCommandListener,
  createCommandObject
} from "./commands";
import {
  createContextMenu,
  updateContextMenu,
  addOnClickListener as addOnMenuClickListener
} from "./menus";
import { sendMessageToBackground, addOnMessageListener } from "./runtime";
import {
  addOnClickListener as addOnBrowserActionClickListener,
  setTitle as setBrowserActionTitle,
  setBadgeText as setBrowserActionBadgeText,
  setIcon as setBrowserActionIcon
} from "./browser-action";
import {
  getAllWindow,
  addOnCreatedListener as addOnWindowCreatedListener,
  addOnRemovedListener as addOnWindowRemovedListener,
  addOnFocusChangedListener as addOnWindowFocusChangedListener,
  isValidWindowId
} from "./windows";

export {
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabAttachedListener,
  addOnTabUpdatedListener,
  addOnTabRemovedListener,
  getCurrentTab,
  getActivatedTabs,
  getTab,
  isValidTabId,
  saveItemOnSyncStorage,
  loadItemOnSyncStorage,
  loadAllItemsOnSyncStorage,
  removeItemOnSyncStorage,
  removeAllItemsOnSyncStorage,
  addOnChangeListenerInStorage,
  updateCommand,
  addOnCommandListener,
  createCommandObject,
  createContextMenu,
  updateContextMenu,
  addOnMenuClickListener,
  sendMessageToBackground,
  addOnMessageListener,
  addOnBrowserActionClickListener,
  setBrowserActionTitle,
  setBrowserActionBadgeText,
  setBrowserActionIcon,
  addOnWindowCreatedListener,
  addOnWindowFocusChangedListener,
  addOnWindowRemovedListener,
  isValidWindowId
};
