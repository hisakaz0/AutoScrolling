import {
  sendMessage as sendMessageToTab,
  addOnActivatedListener as addOnTabActivatedListener,
  addOnAttachedListener as addOnTabAttachedListener,
  addOnUpdatedListener as addOnTabUpdatedListener,
  getCurrent as getCurrentTab,
  getActivated as getActivatedTabs,
  get as getTab
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
import { addOnFocusChangedListener as addOnWindowFocusChangedListener } from "./windows";

export {
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabAttachedListener,
  addOnTabUpdatedListener,
  getCurrentTab,
  getActivatedTabs,
  getTab,
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
  addOnWindowFocusChangedListener
};
