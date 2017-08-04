
let autoScroll = {
  speed: 50,
  step: 1,
  tid: -1,
  start: function () {
    window.scroll(window.scrollX, window.scrollY + this.step);
    let _this = this;
    this.tid = setTimeout(function () {
      _this.start();
    }, this.speed);
  },
  stop: function () {
    clearTimeout(this.tid);
    this.tid = -1;
  }
};

function autoScrollFunction (msg) {
  if (autoScroll.tid == -1) {
    autoScroll.start();
  } else {
    autoScroll.stop();
  }
}

browser.runtime.onMessage.addListener(autoScrollFunction);
