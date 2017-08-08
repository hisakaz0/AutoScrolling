
"use strict";

let browser_action = {
  isScroll: false,
  tid: -1
};

browser.browserAction.onClicked.addListener((tab) => {
  browser_action.isScroll = !browser_action.isScroll;
  browser_action.tid = tab.id;
  browser.tabs.sendMessage(tab.id,
      {isScroll: browser_action.isScroll});
});

browser.tabs.onActivated.addListener(function (tabId, windowId) {
  if (browser_action.isScroll) {
    browser.tabs.sendMessage(browser_action.tid, {isScroll: false});
  }
  browser_action.isScroll = false;
});
