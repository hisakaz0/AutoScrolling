import {
  sendMessage as sendMessageToTab,
  addOnActivatedListener as addOnTabActivatedListener,
  addOnAttachedListener as addOnTabAttachedListener,
  addOnUpdatedListener as addOnTabUpdatedListener,
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
  addOnClickListener,
  addOnWindowCreatedListener,
  addOnWindowFocusChangedListener,
  addOnWindowRemovedListener,
  isValidWindowId
};
