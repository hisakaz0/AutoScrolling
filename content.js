
"use strict";

let autoScroll = {
  speed: 50,
  step: 1,
  tid: -1,
  start: function () {
    window.scroll(window.scrollX, window.scrollY + this.step);
    let _this = this;
    this.tid = setTimeout(function () {
      _this.start();
    }, 100 - this.speed);
  },
  stop: function () {
    clearTimeout(this.tid);
    this.tid = -1;
  }
};

function autoScrollFunction (msg) {
  if (msg.isScroll) {
    autoScroll.start();
  } else {
    autoScroll.stop();
  }
}

browser.runtime.onMessage.addListener(autoScrollFunction);

browser.storage.onChanged.addListener(function(changes, area) {
  var changedItems = Object.keys(changes);
  console.log(changes)
  for (var item of changedItems) {
    if (item == "speed") {
      autoScroll.speed = parseInt(changes[item]["newValue"]);
      console.log(autoScroll.speed);
    }
  }
});
