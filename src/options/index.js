
'use strict';

import { setValueToStorage, onError } from '../utils';

/*
 *  It is consists of the following specification of this object, 'addon_options'.
 *  addon_options = {
 *    "name1": value1,
 *    "name2": value2,
 *    ...
 *  };
 */
const addonOptions = {
  scrollingSpeed: 50,
  stopScrollingByClick: true,
};

const setupOnDOMContentLoaded = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const scrollingSpeedEl =
      document.getElementById('scrolling-speed');
    const stopScrollingByClickEl =
      document.getElementById('stop-scrolling-by-click');

    scrollingSpeedEl.addEventListener('change', setScrollingSpeed);
    stopScrollingByClickEl.addEventListener('change', setStopScrollingByClick);

    const options = getValueFromStorage(addonOptions);
    scrollingSpeedEl.value = parseInt(options.scrollingSpeed);
    stopScrollingByClickEl.checked = items.stopScrollingByClick;
  });
};

const setScrollingSpeed = (ev) => {
  if (ev.target.name != 'scrolling-speed') {
    return;
  }
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  }
  else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
  setValueToStorage({ scrollingSpeed: scrollingSpeed });
};

const setStopScrollingByClick = (ev) => {
  if (ev.target.name != 'stop-scrolling-by-click') {
    return;
  }
  let stopScrollingByClick = ev.target.checked;
  setValueToStorage({ stopScrollingByClick: stopScrollingByClick });
};

setupOnDOMContentLoaded();

export { addonOptions,
  setupOnDOMContentLoaded,
  setScrollingSpeed,
  setStopScrollingByClick
};
