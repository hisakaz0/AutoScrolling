
'use strict';

import { onError } from '../utils';
import './index.css';

const autoScrolling = {
  tid: -1,
  x: 0,
  y: 0,
  scrollingStep: 1,
  scrollingSpeed: 50,
  scrollingElement: document.documentElement,
  stopScrollingByClick: true,
  start: function () {
    this.y = this.y + this.scrollingStep;
    this.scrollingElement.scroll(this.x, this.y);
    this.tid = setTimeout(() => {
      this.start();
    }, 100 - this.scrollingSpeed);
  },
  stop: function () {
    clearTimeout(this.tid);
    this.tid = -1;
  },
};

const getScrollingElement = () => {
  return document.scrollingElement ?
    document.scrollingElement : document.documentElement;
};

const defaultStopScrollingByClick = true;
browser.storage.sync.get({
  stopScrollingByClick: defaultStopScrollingByClick
}).then((data) => {
  const { stopScrollingByClick } = data;
  autoScrolling.stopScrollingByClick = stopScrollingByClick;
}).catch(onError);

const defaultScrollingSpeed = 50;
browser.storage.sync.get({
  scrollingSpeed: defaultScrollingSpeed
}).then((data) => {
  const { scrollingSpeed } = data;
  autoScrolling.scrollingSpeed= scrollingSpeed;
}).catch(onError);


browser.runtime.onMessage.addListener((msg) => {
  if (!msg.isScrolling && autoScrolling.tid !== -1) {
    autoScrolling.stop();
  } else if (msg.isScrolling) {
    new Promise((resolve, reject) => {
      autoScrolling.x = window.scrollX;
      autoScrolling.y = window.scrollY;
      autoScrolling.scrollingElement = getScrollingElement();
      return resolve();
    }).then(() => {
      autoScrolling.start();
    });
  }

  if (msg.isOpenOverlay) {
    openOverlay();
  }
});

browser.storage.onChanged.addListener((changes) => {
  var changedItems = Object.keys(changes);
  for (var item of changedItems) {
    if (item == 'scrollingSpeed') {
      autoScrolling.scrollingSpeed = parseInt(changes[item]['newValue']);
    }
    if (item == 'stopScrollingByClick') {
      autoScrolling.stopScrollingByClick = changes[item]['newValue'];
    }
  }
});

document.body.addEventListener('click', () => {
  if (autoScrolling.tid !== -1 &&
      autoScrolling.stopScrollingByClick == true) {
    browser.runtime.sendMessage({
      isScrolling: false
    }).then(() => {
      autoScrolling.stop();
    }).catch(onError);
  }
});

const openOverlay = () => {
  let overlayEle = document.getElementById('auto-scrolling-overlay');
  overlayEle.classList = [ 'auto-scrolling-overlay is-open' ];
};

const closeOverlay = () => {
  let overlayEle = document.getElementById('auto-scrolling-overlay');
  overlayEle.classList = [ 'auto-scrolling-overlay' ];
};

const insertOverlayEle = () => {
  let overlayEle = document.createElement('div');
  overlayEle.id = 'auto-scrolling-overlay';
  overlayEle.classList = [ 'auto-scrolling-overlay' ];
  overlayEle.innerHTML = require('html-loader!./index.html');
  overlayEle.addEventListener('click', (ev) => {
    browser.runtime.sendMessage({
      isOpenOverlay: false
    }).then((response) => {
      closeOverlay();
    });
  });
  document.body.appendChild(overlayEle);

  let overlayWrapperEle =
    document.getElementById('auto-scrolling-overlay-wrapper');
  overlayWrapperEle.addEventListener('click', (ev) => {
    ev.stopPropagation();
  });
};

insertOverlayEle();

const setupOverlayWindow= () => {
  const scrollingSpeedEl = document.getElementById(
    'auto-scrolling-overlay-scrolling-speed');
  const stopScrollingByClickEl = document.getElementById(
    'auto-scrolling-overlay-stop-scrolling-by-click');

  scrollingSpeedEl.addEventListener('change',
    setScrollingSpeed);
  stopScrollingByClickEl.addEventListener('change',
    setStopScrollingByClick);

  browser.storage.sync.get({
    scrollingSpeed: 50,
    stopScrollingByClick: true
  }).then((options) => {
    scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
    stopScrollingByClickEl.checked = options.stopScrollingByClick;
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

setupOverlayWindow();
