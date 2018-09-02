
'use strict';

import { onError } from '../utils';

const updateKeyboardShortcut = (shortcutName, newShortcutCombination, updateSync = true) => {
  browser.commands.update(
    {
      name: shortcutName,
      shortcut: newShortcutCombination 
    }
  ).catch(onError);

  if (updateSync) {
    let updateObject = {};
    updateObject[shortcutName] = newShortcutCombination;
    browser.storage.sync.set(updateObject);
  }
};

const setupOptionPage = () => {
  const scrollingSpeedEl =
    document.getElementById('scrolling-speed');
  const stopScrollingByClickEl =
    document.getElementById('stop-scrolling-by-click');
  const stopScrollingOnHoverEl =
    document.getElementById('stop-scrolling-on-hover');
  const shortcutToggleCurrentTabEl =
    document.getElementById('kb-shortcut-toggle-current-tab');

  browser.storage.sync.get({
    scrollingSpeed: 50,
    stopScrollingByClick: true,
    stopScrollingOnHover: false,
    'toggle-scrolling-state': 'Alt+Shift+PageDown' 
  }).then((options) => {
    scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
    stopScrollingByClickEl.checked = options.stopScrollingByClick;
    stopScrollingOnHoverEl.checked = options.stopScrollingOnHover;
    shortcutToggleCurrentTabEl.value = options['toggle-scrolling-state'];
    // Do not update the sync this time since we just read from it, so pass false as the last argument.
    updateKeyboardShortcut('toggle-scrolling-state', options['toggle-scrolling-state'], false);
  });

  scrollingSpeedEl.addEventListener('change', setScrollingSpeed);
  stopScrollingByClickEl.addEventListener('change', setStopScrollingByClick);
  stopScrollingOnHover.addEventListener('change', setStopScrollingOnHover);
  shortcutToggleCurrentTabEl.addEventListener('blur', setShortcutForTogglingCurrentTab);
};

const setScrollingSpeed = (ev) => {
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  }
  else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
  browser.storage.sync.set({ scrollingSpeed });
};

const setStopScrollingByClick = (ev) => {
  let stopScrollingByClick = ev.target.checked;
  browser.storage.sync.set({ stopScrollingByClick });
};

const setStopScrollingOnHover = (ev) => {
  let stopScrollingOnHover = ev.target.checked;
  browser.storage.sync.set({ stopScrollingOnHover });
};

const setShortcutForTogglingCurrentTab = (ev) => {
  let kbShortcut = ev.target.value;
  updateKeyboardShortcut('toggle-scrolling-state', kbShortcut);
};

setupOptionPage();
