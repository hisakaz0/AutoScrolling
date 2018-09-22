"use strict";

import { onError } from "../../modules/utils";
import appConst from "../../appConst.json";

const updateCommandKeybind = (name, shortcut) => {
  return browser.commands.update({ name, shortcut });
};

const setupOptionPage = () => {
  const scrollingSpeedEl = document.getElementById(
    appConst.options.scrollingSpeed.id
  );
  const stopScrollingByClickEl = document.getElementById(
    appConst.options.stopScrollingByClick.id
  );
  const stopScrollingOnHoverEl = document.getElementById(
    appConst.options.stopScrollingOnHover.id
  );
  const keybindSwitchScrollingEl = document.getElementById(
    appConst.options.keybindSwitchScrolling.id
  );
  browser.storage.sync
    .get({
      scrollingSpeed: appConst.options.scrollingSpeed.value,
      stopScrollingByClick: appConst.options.stopScrollingByClick.value,
      stopScrollingOnHover: appConst.options.stopScrollingOnHover.value,
      keybindSwitchScrolling: appConst.options.keybindSwitchScrolling.value
    })
    .then(options => {
      scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
      stopScrollingByClickEl.checked = options.stopScrollingByClick;
      stopScrollingOnHoverEl.checked = options.stopScrollingOnHover;
      keybindSwitchScrollingEl.value = options.keybindSwitchScrolling;
      updateCommandKeybind(
        appConst.options.keybindSwitchScrolling.commandName,
        options.keybindSwitchScrolling
      );
    })
    .catch(onError);

  scrollingSpeedEl.addEventListener("change", setScrollingSpeed);
  stopScrollingByClickEl.addEventListener("change", setStopScrollingByClick);
  stopScrollingOnHoverEl.addEventListener("change", setStopScrollingOnHover);
  keybindSwitchScrollingEl.addEventListener("blur", setKeybindSwitchScrolling);
};

const setScrollingSpeed = ev => {
  let scrollingSpeed = ev.target.value;
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

const setKeybindSwitchScrolling = ev => {
  const keybindSwitchScrolling = ev.target.value;
  updateCommandKeybind(
    appConst.options.keybindSwitchScrolling.commandName,
    keybindSwitchScrolling
  );
  browser.storage.sync.set({ keybindSwitchScrolling });
};

setupOptionPage();
