import browser from './api';

const addOnClickListener = listener => browser.browserAction.onClicked.addListener(listener);

const setTitle = (title, tabId) => browser.browserAction.setTitle({
  title,
  tabId,
});

const setBadgeText = (text, tabId) => browser.browserAction.setBadgeText({
  text,
  tabId,
});

const setIcon = (path, tabId) => browser.browserAction.setIcon({
  path,
  tabId,
});
export {
  addOnClickListener, setTitle, setBadgeText, setIcon,
};
