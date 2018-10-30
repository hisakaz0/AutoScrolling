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

export {
  sendMessage,
  addOnActivatedListener,
  addOnAttachedListener,
  addOnUpdatedListener,
  getCurrent,
  getActivated,
  get
};
