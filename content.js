
"use strict";

let autoScroll = {
  speed: 50,
  step: 1,
  tid: -1,
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

browser.runtime.onMessage.addListener(function (msg) {
  if (msg.isScroll) {
    autoScroll.start();
  } else {
    autoScroll.stop();
  }
});

browser.storage.onChanged.addListener(function(changes, area) {
  var changedItems = Object.keys(changes);
  for (var item of changedItems) {
    if (item == "speed") {
      autoScroll.speed = parseInt(changes[item]["newValue"]);
    }
  }
});
