import browser from './api';

const addOnClickListener = listener => {
  return browser.browserAction.onClicked.addListener(listener);
};

const setTitle = (title, tabId) => {
  return browser.browserAction.setTitle({
    title,
    tabId
  });
};

const setBadgeText = (text, tabId) => {
  return browser.browserAction.setBadgeText({
    text,
    tabId
  });
};

const setIcon = (path, tabId) => {
  return browser.browserAction.setIcon({
    path,
    tabId
  });
};
export { addOnClickListener, setTitle, setBadgeText, setIcon };
