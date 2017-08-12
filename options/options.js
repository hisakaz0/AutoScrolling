
"use strict";

document.addEventListener("DOMContentLoaded", function(ev) {
  let speed_el = document.getElementById('speed');

  speed_el.addEventListener('change', setScrollSpeed);

  browser.storage.sync.get("speed")
  .then((items) => {
    speed_el.value = parseInt(items.speed);
  }, onError);
});

function setScrollSpeed(ev) {
  if (ev.target.name == "speed") {
    let speed = ev.target.value;
    if (speed > 100) {
      speed = 99;
    }
    if (speed < 0) {
      speed = 1;
    }
    browser.storage.sync.set({"speed": speed})
      .catch(onError);
  }
}

function onError(err) {
  console.log(`Error: ${err}`);
}

