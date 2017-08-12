
"use strict";

let speed_el = document.getElementById('speed');
speed_el.addEventListener('change', function(ev) {
  if (ev.target.name == "speed") {
    let speed = ev.target.value;
    if (speed > 100) {
      speed = 99;
    }
    if (speed < 0) {
      speed = 1;
    }
    browser.storage.local.set({"speed": speed})
      .catch(onError);
  }
});

function onError(err) {
  console.log(`Error: ${err}`);
}
