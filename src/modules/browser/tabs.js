const sendMessage = (tabId, msg) => {
  return browser.tabs.sendMessage(tabId, msg);
};

const addOnActivatedListener = listener => {
  return browser.tabs.onActivated.addListener(listener);
};

export { sendMessage, addOnActivatedListener };
