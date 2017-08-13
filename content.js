
"use strict";

let autoScrolling = {
  speed: 50,
  step: 1,
  tid: -1,
  stopByClick: true,
  start: function () {
    window.scroll(window.scrollX, window.scrollY + this.step);
    this.tid = setTimeout(() => {
      this.start();
    }, 100 - this.speed);
  },
  stop: function () {
    clearTimeout(this.tid);
    this.tid = -1;
  }
};

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.isScrolling) {
    autoScrolling.start();
  }
  else if (!msg.isScrolling && autoScrolling.tid !== -1) {
    autoScrolling.stop();
  }
});

browser.storage.onChanged.addListener((changes, area) => {
  var changedItems = Object.keys(changes);
  for (var item of changedItems) {
    if (item == "scrollingSpeed") {
      autoScrolling.speed = parseInt(changes[item]["newValue"]);
    }
    if (item == "stopScrollingByClick") {
      autoScrolling.stopByClick = changes[item]["newValue"];
    }
  }
});

window.document.body.addEventListener("click", (ev) => {
  if (autoScrolling.tid !== -1 && autoScrolling.stopByClick == true) {
    autoScrolling.stop();
    browser.runtime.sendMessage({"isScrolling": false});
  }
});

