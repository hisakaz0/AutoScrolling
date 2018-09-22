"use strict";

import { onError } from "../../modules/utils";

//////////////////////////////////////////////////////////////////////////////
// Constant / Variables

let autoScrollingStates = [];
const initAutoScrollingState = {
  tabId: -1,
  windowId: -1,
  isScrolling: false,
  isWaitingDoubleClick: false,
  isOpenOverlay: false
};

browser.windows
  .getAll()
  .then(windowArray => {
    windowArray.map(window => {
      const windowId = window.id;
      createAutoScrollingState(windowId);
    });
  })
  .catch(onError);

// Unit of both of 'intervalDoubleClick' and 'defaultIntervalDoubleClick' is
// second. defaultIntervalDoubleClick is 1.00 second.
const defaultIntervalDoubleClick = Number(0.5);
const backgroundOptions = {
  intervalDoubleClick: defaultIntervalDoubleClick
};
browser.storage.sync
  .get({
    intervalDoubleClick: defaultIntervalDoubleClick
  })
  .then(data => {
    const { intervalDoubleClick } = data;
    backgroundOptions.intervalDoubleClick = intervalDoubleClick;
  })
  .catch(onError);

//////////////////////////////////////////////////////////////////////////////
// AutoScrolling functions
function createAutoScrollingState(windowId) {
  // Constructor. This function is called when new window is opened.
  if (autoScrollingStates[windowId] != undefined) {
    return;
  }
  autoScrollingStates[windowId] = Object.assign({}, initAutoScrollingState, {
    windowId: windowId
  });
}

function removeAutoScrollingState(window) {
  // Deconstructor. This function is called when a window is exited.
  const windowId = window.id;
  autoScrollingStates[windowId] = undefined;
}

function toggleAutoScrolling(tab) {
  // Toggling the auto scrolling state. This function is called when browser
  // icon is clicked with single click. If double click is detected, this
  // function is not called.
  const tabId = tab.id;
  const windowId = tab.windowId;
  const willIsScrolling = !(
    autoScrollingStates[windowId] && autoScrollingStates[windowId].isScrolling
  );
  browser.tabs
    .sendMessage(tabId, {
      isScrolling: willIsScrolling
    })
    .then(() => {
      autoScrollingStates[windowId].tabId = tabId;
      autoScrollingStates[windowId].isScrolling = willIsScrolling;
    })
    .catch(onError);
}

function receiveAutoScrollingStatus(msg, sender, sendResponse) {
  const windowId = sender.tab.windowId;
  autoScrollingStates[windowId].isScrolling = msg.isScrolling;
}

function stopAutoScrolling(activeInfo) {
  const tabId = activeInfo.tabId;
  const windowId = activeInfo.windowId;
  browser.tabs
    .sendMessage(tabId, {
      isScrolling: false
    })
    .then(response => {
      autoScrollingStates[windowId].isScrolling = false;
    })
    .catch(onError);
}

//////////////////////////////////////////////////////////////////////////////
// Overlay functions

// function disableBrowserActionPopup (msg, sender, sendResponse) {
//   const tabId = sender.tab.id;
//   const windowId = sender.tab.windowId;
//   browser.browserAction.setPopup({
//     tabId: tabId,
//     popup: ''
//   }).then((results) => {
//     autoScrollingStates[ windowId ].isOpenPopup = false;
//   }) .catch(onError);
// }

function resetIsWaitingDoubleClick(windowId) {
  autoScrollingStates[windowId].isWaitingDoubleClick = false;
}

//////////////////////////////////////////////////////////////////////////////
// Event listeners / event functions

// Listens for all of the available and assignable keyboard shortcut commands.
browser.commands.onCommand.addListener(function(command) {
  // https://stackoverflow.com/questions/43695817/tabs-getcurrent-result-is-undefined
  browser.tabs
    .query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT })
    .then(tabs => browser.tabs.get(tabs[0].id))
    .then(currentTab => {
      if (command == "toggle-scrolling-state") {
        toggleAutoScrolling(currentTab);
      }
    })
    .catch(onError);
});

browser.windows.onCreated.addListener(window => {
  const windowId = window.id;
  createAutoScrollingState(windowId);
});

browser.windows.onRemoved.addListener(window => {
  removeAutoScrollingState(window);
});

browser.browserAction.onClicked.addListener(tab => {
  // This function is fired when browser icon is clicked.
  const windowId = tab.windowId;
  if (autoScrollingStates[windowId].isWaitingDoubleClick) {
    browser.tabs
      .sendMessage(tab.id, {
        isOpenOverlay: true
      })
      .then(response => {
        autoScrollingStates[windowId].isOpenOverlay = true;
      });
  }
  setTimeout(() => {
    resetIsWaitingDoubleClick(tab.windowId);
    if (!autoScrollingStates[windowId].isOpenOverlay) {
      toggleAutoScrolling(tab);
    }
  }, backgroundOptions.intervalDoubleClick * 1000);
  autoScrollingStates[windowId].isWaitingDoubleClick = true;
});

browser.tabs.onActivated.addListener(activeInfo => {
  const windowId = activeInfo.windowId;
  const tabId = activeInfo.tabId;
  if (autoScrollingStates[windowId] == undefined) {
    createAutoScrollingState(windowId);
  }
  if (
    autoScrollingStates[windowId].isScrolling &&
    autoScrollingStates[windowId].tabId != tabId
  ) {
    stopAutoScrolling(activeInfo);
  }
});

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // This event is fired when content scripts sent message.
  if (msg.isScrolling != undefined) {
    receiveAutoScrollingStatus(msg, sender, sendResponse);
  }
  if (msg.isOpenOverlay == false) {
    autoScrollingStates[sender.tab.windowId].isOpenOverlay = false;
  }
  if (msg["toggle-scrolling-state"] != undefined) {
    browser.commands.update({
      name: "toggle-scrolling-state",
      shortcut: msg["toggle-scrolling-state"]
    });
  }
});
