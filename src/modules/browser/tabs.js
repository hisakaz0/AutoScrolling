const sendMessage = (tabId, msg) => {
  return browser.tabs.sendMessage(tabId, msg);
};

const addOnActivatedListener = listener => {
  return browser.tabs.onActivated.addListener(listener);
};

const addOnAttachedListener = listener => {
  return browser.tabs.onAttached.addListener(listener);
};

const addOnUpdatedListener = listener => {
  return browser.tabs.onUpdated.addListener(listener);
};

const getCurrent = () => {
  return browser.tabs.getCurrent();
};

const getActivated = () => {
  return browser.tabs.query({ active: true });
};

const get = tabId => {
  return browser.tabs.get(tabId);
};

const isValidTabId = id => {
  // TypeError is throwed when `TAB_ID_NONE` is loaded in content script
  return id !== undefined && id !== null && id !== browser.tabs.TAB_ID_NONE;
};
export {
  sendMessage,
  addOnActivatedListener,
  addOnAttachedListener,
  addOnUpdatedListener,
  getCurrent,
  getActivated,
  get,
  isValidTabId
};
