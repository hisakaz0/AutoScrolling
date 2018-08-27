
'use strict';

import { onError } from '../utils';

const updateKeyboardShortcut = (shortcutName, newShortcutCombination) => {
  browser.commands.update(
    {
      name: shortcutName,
      shortcut: newShortcutCombination 
    }
  ).catch(onError);
};

const setupOptionPage = () => {
  const scrollingSpeedEl =
    document.getElementById('scrolling-speed');
  const stopScrollingByClickEl =
    document.getElementById('stop-scrolling-by-click');
  const shortcutToggleCurrentTab =
    document.getElementById('kb-shortcut-toggle-current-tab');

  scrollingSpeedEl.addEventListener('change', setScrollingSpeed);
  stopScrollingByClickEl.addEventListener('change', setStopScrollingByClick);
  shortcutToggleCurrentTab.addEventListener('blur', setShortcutForTogglingCurrentTab);

  browser.storage.sync.get({
    scrollingSpeed: 50,
    stopScrollingByClick: true,
    shortcutToggleCurrentTab: 'Ctrl+Shift+PageDown'
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
  let shortcutToggleCurrentTab = ev.target.value;
  browser.storage.sync.set({ shortcutToggleCurrentTab });
};

setupOptionPage();
