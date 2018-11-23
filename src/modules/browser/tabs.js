import browser from './api';

const sendMessage = (tabId, msg) => browser.tabs.sendMessage(tabId, msg);

const addOnActivatedListener = listener => browser.tabs.onActivated.addListener(listener);

const addOnAttachedListener = listener => browser.tabs.onAttached.addListener(listener);

const addOnUpdatedListener = listener => browser.tabs.onUpdated.addListener(listener);

const addOnRemovedListener = listener => browser.tabs.onRemoved.addListener(listener);

const getCurrent = () => browser.tabs.getCurrent();

const getActivated = () => browser.tabs.query({ active: true });

const get = tabId => browser.tabs.get(tabId);

const isValidTabId = id => id !== undefined && id !== null && id !== browser.tabs.TAB_ID_NONE;

export {
  sendMessage,
  addOnActivatedListener,
  addOnAttachedListener,
  addOnUpdatedListener,
  addOnRemovedListener,
  getCurrent,
  getActivated,
  get,
  isValidTabId,
};
