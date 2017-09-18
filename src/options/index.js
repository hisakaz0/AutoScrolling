
'use strict';

import { onError } from '../utils';

const setupOptionPage = () => {
  const scrollingSpeedEl =
    document.getElementById('scrolling-speed');
  const stopScrollingByClickEl =
    document.getElementById('stop-scrolling-by-click');

  scrollingSpeedEl.addEventListener('change', setScrollingSpeed);
  stopScrollingByClickEl.addEventListener('change', setStopScrollingByClick);

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

setupOptionPage();
