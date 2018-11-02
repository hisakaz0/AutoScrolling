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
import { sendMessageToBackground, addOnMessageListener } from "./runtime";
import { addOnClickListener } from "./browser-action";
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
  sendMessageToBackground,
  addOnMessageListener,
  addOnClickListener,
  addOnWindowCreatedListener,
  addOnWindowFocusChangedListener,
  addOnWindowRemovedListener,
  isValidWindowId
};
