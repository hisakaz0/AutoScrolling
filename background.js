
"use strict";

let browser_action = {
  isScroll: false,
  tid: -1,
  wid: -1
};

browser.browserAction.onClicked.addListener((tab) => {
  browser_action.isScroll = !browser_action.isScroll;
  browser_action.tid = tab.id;
  browser_action.wid = tab.windowId;
  browser.tabs.sendMessage(tab.id,
      {isScroll: browser_action.isScroll});
});

browser.tabs.onActivated.addListener(function (activeInfo) {
  if (browser_action.isScroll &&
    browser_action.wid == activeInfo.windowId) {
    browser.tabs.sendMessage(
      browser_action.tid, {isScroll: false});
    browser_action.isScroll = false;
  }
});
