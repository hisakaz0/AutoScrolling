"use strict";

import { onError } from "../utils";
import appConst from "../appConst.json";

const updateKeyboardShortcut = (
  shortcutName,
  newShortcutCombination,
  updateSync = true
) => {
  browser.commands
    .update({
      name: shortcutName,
      shortcut: newShortcutCombination
    })
    .catch(onError);

  if (updateSync) {
    let updateObject = {};
    updateObject[shortcutName] = newShortcutCombination;
    browser.storage.sync.set(updateObject);
  }
};

const setupOptionPage = () => {
  const scrollingSpeedEl = document.getElementById(
    appConst.options.scrollingSpeed.elementId
  );
  const stopScrollingByClickEl = document.getElementById(
    appConst.options.stopScrollingByClick.elementId
  );
  const stopScrollingOnHoverEl = document.getElementById(
    appConst.options.keybindSwitchScrolling.elementId
  );
  const shortcutToggleCurrentTabEl = document.getElementById(
    appConst.options.stopScrollingOnMouseHover.elementId
  );
  browser.storage.sync
    .get({
      scrollingSpeed: appConst.options.scrollingSpeed.defaultValue,
      stopScrollingByClick: appConst.options.stopScrollingByClick.defaultValue,
      stopScrollingOnHover:
        appConst.options.stopScrollingOnMouseHover.defaultValue,
      "toggle-scrolling-state":
        appConst.options.keybindSwitchScrolling.defaultValue
    })
    .then(options => {
      scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
      stopScrollingByClickEl.checked = options.stopScrollingByClick;
      stopScrollingOnHoverEl.checked = options.stopScrollingOnHover;
      shortcutToggleCurrentTabEl.value = options["toggle-scrolling-state"];
      // Do not update the sync this time since we just read from it, so pass false as the last argument.
      updateKeyboardShortcut(
        "toggle-scrolling-state",
        options["toggle-scrolling-state"],
        false
      );
    });

  scrollingSpeedEl.addEventListener("change", setScrollingSpeed);
  stopScrollingByClickEl.addEventListener("change", setStopScrollingByClick);
  stopScrollingOnHoverEl.addEventListener("change", setStopScrollingOnHover);
  shortcutToggleCurrentTabEl.addEventListener(
    "blur",
    setShortcutForTogglingCurrentTab
  );
};

const setScrollingSpeed = ev => {
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  } else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
  browser.storage.sync.set({ scrollingSpeed });
};

const setStopScrollingByClick = ev => {
  let stopScrollingByClick = ev.target.checked;
  browser.storage.sync.set({ stopScrollingByClick });
};

const setStopScrollingOnHover = ev => {
  let stopScrollingOnHover = ev.target.checked;
  browser.storage.sync.set({ stopScrollingOnHover });
};

const setShortcutForTogglingCurrentTab = ev => {
  let kbShortcut = ev.target.value;
  updateKeyboardShortcut("toggle-scrolling-state", kbShortcut);
};

setupOptionPage();
