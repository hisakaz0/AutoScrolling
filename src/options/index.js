
'use strict';

import { onError } from '../utils';

const updateKeyboardShortcut = (shortcutName, newShortcutCombination) => {
  console.log('Updating', shortcutName, newShortcutCombination);
  browser.commands.update(
    {
      name: shortcutName,
      shortcut: newShortcutCombination 
    }
  ).catch(onError);
  browser.storage.sync.set({ shortcutToggleCurrentTab });
};

const setupOptionPage = () => {
  const scrollingSpeedEl =
    document.getElementById('scrolling-speed');
  const stopScrollingByClickEl =
    document.getElementById('stop-scrolling-by-click');
  const shortcutToggleCurrentTabEl =
    document.getElementById('kb-shortcut-toggle-current-tab');

  scrollingSpeedEl.addEventListener('change', setScrollingSpeed);
  stopScrollingByClickEl.addEventListener('change', setStopScrollingByClick);
  shortcutToggleCurrentTabEl.addEventListener('blur', setShortcutForTogglingCurrentTab);

  browser.storage.sync.get({
    scrollingSpeed: 50,
    stopScrollingByClick: true,
    shortcutToggleCurrentTab: 'Alt+Shift+PageDown'
  }).then((options) => {
    scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
    stopScrollingByClickEl.checked = options.stopScrollingByClick;
    updateKeyboardShortcut('toggle-scrolling-state', options.shortcutToggleCurrentTab);
  });
};

const setScrollingSpeed = (ev) => {
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  }
  else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
  browser.storage.sync.set({ scrollingSpeed: scrollingSpeed });
};

const setStopScrollingByClick = (ev) => {
  let stopScrollingByClick = ev.target.checked;
  browser.storage.sync.set({ stopScrollingByClick: stopScrollingByClick });
};

const setShortcutForTogglingCurrentTab = (ev) => {
  let kbShortcut = ev.target.value;
  updateKeyboardShortcut('toggle-scrolling-state', kbShortcut);
};

setupOptionPage();
