import {
  sendMessage as sendMessageToTab,
  addOnActivatedListener as addOnTabActivatedListener,
  addOnUpdatedListener as addOnTabUpdatedListener,
  getCurrent as getCurrentTab,
  getActivated as getActivatedTabs
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

export {
  sendMessageToTab,
  addOnTabActivatedListener,
  addOnTabUpdatedListener,
  getCurrentTab,
  getActivatedTabs,
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
  addOnClickListener
};
