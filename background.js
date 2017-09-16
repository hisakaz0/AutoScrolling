
'use strict';

const browser_action = {
  isScrolling: false,
  tid: -1,
  wid: -1
};

browser.browserAction.onClicked.addListener((tab) => {
  browser_action.isScrolling = !browser_action.isScrolling;
  browser_action.tid = tab.id;
  browser_action.wid = tab.windowId;
  browser.tabs.sendMessage(tab.id,
    { isScrolling: browser_action.isScrolling }).catch(onError);
});

browser.tabs.onActivated.addListener((activeInfo) => {
  if (browser_action.isScrolling &&
    browser_action.wid == activeInfo.windowId) {
    browser.tabs.sendMessage(browser_action.tid, { isScrolling: false })
      .catch(onError);
    browser_action.isScrolling = false;
  }
});

browser.runtime.onMessage.addListener((msg) => {
  browser_action.isScrolling = msg.isScrolling;
});

function onError(err) {
  console.error(`Error: ${err}`);
}
