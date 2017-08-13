
"use strict";

/*
 *  It is consists of the following specification of this object, 'addon_options'.
 *  addon_options = {
 *    "name1": value1,
 *    "name2": value2,
 *    ...
 *  };
 */
let addon_options = {
  "scrollingSpeed": 50,
  "stopScrollingByClick": true
};

document.addEventListener("DOMContentLoaded", (ev) => {
  let scrolling_speed_el = document.getElementById('scrolling-speed');
  let stop_scrolling_by_click_el = document.getElementById('stop-scrolling-by-click');

  scrolling_speed_el.addEventListener('change', setScrollingSpeed);
  stop_scrolling_by_click_el.addEventListener('change', setStopScrollingByClick);

  browser.storage.sync.get(addon_options)
  .then((items) => {
    scrolling_speed_el.value = parseInt(items.scrollingSpeed);
    stop_scrolling_by_click_el.checked = items.stopScrollingByClick;
  }, onError);
});

function setScrollingSpeed(ev) {
  if (ev.target.name != "scrolling-speed") {
    return;
  }
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  }
  else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
  browser.storage.sync.set({"scrollingSpeed": scrollingSpeed})
    .catch(onError);
}

function setStopScrollingByClick(ev){
  if (ev.target.name != "stop-scrolling-by-click") {
    return;
  }
  let stopScrollingByClick = ev.target.checked;
  browser.storage.sync.set({"stopScrollingByClick": stopScrollingByClick})
    .catch(onError);
}

function onError(err) {
  console.log(`Error: ${err}`);
}

