
'use strict';

import { onError } from '../utils';

const updateKeyboardShortcut = (shortcutName, newShortcutCombination) => {
  browser.commands.update(
    {
      name: shortcutName,
      shortcut: newShortcutCombination 
    }
  ).catch(onError);
  let updateObject = {};
  updateObject[shortcutName] = newShortcutCombination;
  browser.storage.sync.set(updateObject);
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
    'toggle-scrolling-state': 'Alt+Shift+PageDown' 
  }).then((options) => {
    scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
    stopScrollingByClickEl.checked = options.stopScrollingByClick;
    shortcutToggleCurrentTabEl.value = options['toggle-scrolling-state'];
    updateKeyboardShortcut('toggle-scrolling-state', options['toggle-scrolling-state']);
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
