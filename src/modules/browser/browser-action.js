const addOnClickListener = listener => {
  return browser.browserAction.onClicked.addListener(listener);
};

const setTitle = (title, tabId, windowId) => {
  return browser.browserAction.setTitle({
    title,
    tabId,
    windowId
  });
};

const setBadgeText = (text, tabId, windowId) => {
  return browser.browserAction.setBadgeText({
    text,
    tabId,
    windowId
  });
};

const setIcon = (path, tabId, windowId) => {
  return browser.browserAction.setIcon({
    path,
    tabId,
    windowId
  });
};
export { addOnClickListener, setTitle, setBadgeText, setIcon };
