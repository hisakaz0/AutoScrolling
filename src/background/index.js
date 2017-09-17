
'use strict';

//////////////////////////////////////////////////////////////////////////////
// Constant / Variables

const autoScrollingStates = [];
const initAutoScrollingState = {
  tabId: -1,
  windowId: -1,
  isScrolling: false,
  isWaitingDoubleClick: false,
  isOpenPopup: false
}
// Unit of both of 'intervalDoubleClick' and 'defaultIntervalDoubleClick' is
// second. defaultIntervalDoubleClick is 1.00 second.
const defaultIntervalDoubleClick = 1.00;
const intervalDoubleClick =
  getValueFromStorage({ intervalDoubleClick: defaultIntervalDoubleClick })

/////////////////////////////////////////////////////////////////////////////
// Storage functions
function setValueToStorage (objects) {
  // Function to set value into storages.
  //    @param value: Object
  browser.storage.sync.set(objects)
  .then( (results) => {
    return results;
  })
  .catch( (error) => {
    onError(error);
    browser.storage.local.set(objects)
    .then( (results) => {
      return results;
    })
    .catch(onError);
  });
}

function getValueFromStorage (objects) {
  // Function to get value from storages.
  //    @param value: Object
  const keysArray = keys(objects);
  browser.storage.sync.get(keysArray)
  .then( (results) => {
    return results;
  })
  .catch( (error) => {
    onError(error);
    browser.storage.local.get(objects)
    .then( (results) => {
      return results;
    })
    .catch(onError);
  });
}

//////////////////////////////////////////////////////////////////////////////
// AutoScrolling functions
function createAutoScrollingState (window) {
  // Constructor. This function is called when new window is opened.
  const windowId = window.id;
  autoScrollingStates[ windowId ] = Object.assign(
    {}, initAutoScrollingState, { windowId: windowId });
}

function removeAutoScrollingState (window) {
  // Deconstructor. This function is called when a window is exited.
  const windowId = window.id;
  autoScrollingStates[ windowId ] = undefined;
}

function toggleAutoScrolling (tab) {
  // Toggling the auto scrolling state. This function is called when browser
  // icon is clicked with single click. If double click is detected, this
  // function is not called.
  const tabId = tab.id;
  const windowId = tab.windowId;
  const willIsScrolling = ! autoScrollingStates[ windowId ].isScrolling;
  browser.tabs.sendMessage(tabId, {
    tabId: tabId, windowId: windowId, isScrolling: willIsScrolling })
  .then(() => {
    autoScrollingStates[ windowId ].isScrolling = willIsScrolling;
    autoScrollingStates[ windowId ].tabId = tabId;
    autoScrollingStates[ windowId ].windowId = windowId;
  })
  .catch(onError);
}

function receiveAutoScrollingStatus (msg, sender, sendResponse) {
  const windowId = sender.tab.windowId;
  autoScrollingStates[ windowId ].isScrolling = msg.isScrolling;
}

function stopAutoScrolling (activeInfo) {
  const tabId = activeInfo.tabId;
  const windowId = activeInfo.windowId;
  browser.tabs.sendMessage(tabId, { isScrolling: false })
  .then( (results) => {
    autoScrollingStates[ windowId ].isScrolling = false;
  })
  .catch(onError);
}

//////////////////////////////////////////////////////////////////////////////
// Popup functions

function openPopup(tab) {
  const tabId = tab.id;
  const windowId = tab.windowId;
  browser.browserAction.setPopup(
    { "tabId": tabId,
      "popup": browser.extension.getURL("popup/index.html") }
  ).then( (results) => {
    autoScrollingStates[ windowId ].isOpenPopup = true;
  }).catch(onError);
}

function disableBrowserActionPopup (msg, sender, sendResponse) {
  const tabId = sender.tab.id;
  const windowId = sender.tab.windowId;
  browser.browserAction.setPopup({ "tabId": tabId, "popup": "" })
  .then( (results) => {
    autoScrollingStates[ windowId ].isOpenPopup = false;
  })
  .catch(onError);
}


//////////////////////////////////////////////////////////////////////////////
// Event listeners / event functions

browser.windows.onCreated.addListener((window) => {
  createAutoScrollingState(window);
});

browser.windows.onRemoved.addListener((window) => {
  removeAutoScrollingState(window);
});

browser.browserAction.onClicked.addListener((tab) => {
  // This function is fired when browser icon is clicked.
  const windowId = tab.windowId;
  if (autoScrollingStates[ windowId ].isWaitingDoubleClick) {
    openPopup(tab);
  }
  setTimeout(() => {
    resetIsWaitingDoubleClick(tab);
    if (!autoScrollingStates[ windowId ].isOpenPopup) {
      toggleAutoScrolling(tab);
    }
  }, intervalDoubleClick * 1000 );
  autoScrollingStates[ windowId ].isWaitingDoubleClick = true;
});

function resetIsWaitingDoubleClick (tab) {
  const windowId = tab.windowId;
  autoScrollingStates[ windowId ].isWaitingDoubleClick = false;
}

browser.tabs.onActivated.addListener((activeInfo) => {
  const windowId = activeInfo.windowId;
  const tabId = activeInfo.tabId;
  if (autoScrollingStates[ windowId ].isScrolling &&
    autoScrollingStates[ windowId ].tabId != tabId &&
    autoScrollingStates[ windowId ].windowId == windowId) {
    stopAutoScrolling(activeInfo);
  }
});

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // This event is fired when content scripts sent message.
  if (msg.isScrolling != undefined) {
    receiveAutoScrollingStatus(msg, sender, sendResponse);
  }
  if (msg.bodyClicked != undefined) {
    disableBrowserActionPopup(msg, sender, sendResponse);
  }
});

function onError(err) {
  console.log(`Error: ${err}`);
}
