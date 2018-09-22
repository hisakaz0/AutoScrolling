"use strict";

import { onError } from "../../modules/utils";
import { parseSpeed } from "../../modules/scrolling";
import appConst from "../../appConst.json";

const getScrollingElement = () => {
  return document.scrollingElement
    ? document.scrollingElement
    : document.documentElement;
};

const defaultValues = {
  intervalId: -1,
  x: 0,
  y: 0,
  scrollingElement: getScrollingElement(),
  currentlyHovering: false,
  scrollingStep: 1,
  scrollingInterval: 1000,
  scrollingSpeed: appConst.options.scrollingSpeed.value,
  stopScrollingByClick: appConst.options.stopScrollingByClick.value,
  stopScrollingOnHover: appConst.options.stopScrollingOnHover.value
};

let autoScrolling = Object.assign({}, defaultValues, {
  scrollingAction: function() {
    if (this.stopScrollingOnHover && this.currentlyHovering) {
      return;
    }
    this.y = this.y + this.scrollingStep;
    this.scrollingElement.scroll(this.x, this.y);
  },
  setScrollingSpeed: function() {
    const speed = parseSpeed(this.scrollingSpeed);
    this.scrollingStep = speed.step;
    this.scrollingInterval = speed.interval;
  },
  start: function() {
    this.setScrollingSpeed();
    this.scrollingElement = getScrollingElement();
    removeMouseListeners();
    addMouseListeners();
    this.intervalId = window.setInterval(
      this.scrollingAction.bind(this),
      this.scrollingInterval
    );
  },
  stop: function() {
    removeMouseListeners();
    window.clearInterval(this.intervalId);
  }
});

const updateFromSync = () => {
  const {
    scrollingSpeed,
    stopScrollingByClick,
    stopScrollingOnHover
  } = defaultValues;

  browser.storage.sync
    .get({
      scrollingSpeed,
      stopScrollingByClick,
      stopScrollingOnHover
    })
    .then(data => {
      Object.assign(autoScrolling, data);
    })
    .catch(onError);
};

updateFromSync();

// DOM Events
const mouseoverListeners = ev => {
  const target = ev.target;
  if (!autoScrolling.stopScrollingOnHover) {
    return;
  }
  if (target == document.body) {
    autoScrolling.currentlyHovering = false;
  } else {
    let targetRect = target.getBoundingClientRect();
    // Check if the mouse is overlapping with the element's dimensions.
    if (
      targetRect.width != document.body.clientWidth &&
      (targetRect.right > ev.pageX || targetRect.top > ev.pageY)
    ) {
      autoScrolling.currentlyHovering = true;
    } else {
      autoScrolling.currentlyHovering = false;
    }
  }
};

const mouseoutListeners = () => {
  autoScrolling.currentlyHovering = false;
};

const clickListeners = () => {
  if (autoScrolling.stopScrollingByClick == true) {
    browser.runtime
      .sendMessage({
        isScrolling: false
      })
      .then(() => {
        autoScrolling.stop();
      })
      .catch(onError);
  }
};

const addMouseListeners = () => {
  document.body.addEventListener("mouseover", mouseoverListeners);
  document.body.addEventListener("mouseout", mouseoutListeners);
  document.body.addEventListener("click", clickListeners);
};

const removeMouseListeners = () => {
  document.body.removeEventListener("mouseover", mouseoverListeners);
  document.body.removeEventListener("mouseout", mouseoutListeners);
  document.body.removeEventListener("click", clickListeners);
};

// WebExtensions Events
browser.runtime.onMessage.addListener(msg => {
  if (msg.isScrolling) {
    autoScrolling.x = window.scrollX;
    autoScrolling.y = window.scrollY;
    autoScrolling.scrollingElement = getScrollingElement();
    autoScrolling.start();
  } else {
    autoScrolling.stop();
  }

  if (msg.isOpenOverlay) {
    loadAllOptionsOnStorage()
      .then(options => {
        return Promise.all(setOnOptionWindowWith(options));
      })
      .then(() => {
        openOverlay();
      })
      .catch(onError);
  }
});

const setOnOptionWindowWith = options => {
  return Object.keys(appConst.options).map(key => {
    return new Promise(resolve => {
      resolve(setValueOnInput(appConst.options[key].id, options[key]));
    });
  });
};

const setValueOnInput = (id, value) => {
  const ele = document.getElementById(id);
  if (typeof value === "Boolean") ele.checked = value;
  ele.value = value;
};

browser.storage.onChanged.addListener(changes => {
  var changedItems = Object.keys(changes);
  for (var item of changedItems) {
    if (item == "scrollingSpeed") {
      autoScrolling.scrollingSpeed = parseInt(changes[item]["newValue"]);
    }
    if (item == "stopScrollingByClick") {
      autoScrolling.stopScrollingByClick = changes[item]["newValue"];
    }
  }
});

// Autoscrolling Overlay
const openOverlay = () => {
  return document
    .getElementById(appConst.html.modal.id)
    .classList.add("active");
};

const closeOverlay = () => {
  return document
    .getElementById(appConst.html.modal.id)
    .classList.remove("active");
};

const setScrollingSpeed = ev => {
  let scrollingSpeed = parseInt(ev.target.value);
  autoScrolling.scrollingSpeed = scrollingSpeed;
  browser.storage.sync.set({ scrollingSpeed: scrollingSpeed });
};

const setStopScrollingByClick = ev => {
  let stopScrollingByClick = ev.target.checked;
  autoScrolling.stopScrollingByClick = stopScrollingByClick;
  browser.storage.sync.set({ stopScrollingByClick: stopScrollingByClick });
};

const sendMessageCloseModal = ev => {
  browser.runtime
    .sendMessage({ isOpenOverlay: false })
    .then(() => {
      closeOverlay();
    })
    .catch(onError);
};

function insertOverlayElement() {
  let overlayEle = document.createElement("div");
  overlayEle.id = appConst.html.wrapper.id;
  overlayEle.innerHTML = require("../../../dist/modal.html");
  return new Promise(resolve => {
    resolve(document.body.appendChild(overlayEle));
  });
}

function setupOverlayWindow() {
  insertOverlayElement()
    .then(setEvetListeners)
    .catch(onError);
}

function setEvetListeners(parent) {
  document
    .querySelectorAll(`[${appConst.html.modal.closeAttribute}]`)
    .forEach(ele => {
      ele.addEventListener("click", sendMessageCloseModal);
    });
  document
    .getElementById(appConst.options.scrollingSpeed.id)
    .addEventListener("change", setScrollingSpeed);
  document
    .getElementById(appConst.options.stopScrollingByClick.id)
    .addEventListener("change", setStopScrollingByClick);
  document
    .getElementById(appConst.options.stopScrollingOnHover.id)
    .addEventListener("change", listenerOnChangeStopScrollingOnHover);
  document
    .getElementById(appConst.options.keybindSwitchScrolling.id)
    .addEventListener("blur", listenerOnBlurKeybindSwitchScrolling);
}

const listenerOnChangeStopScrollingOnHover = ev => {
  const newValue = ev.target.checked;
  autoScrolling.stopScrollingOnHover = newValue;
  saveOptionOnStorageWith({ stopScrollingOnHover: newValue }).catch(onError);
};

const listenerOnBlurKeybindSwitchScrolling = ev => {
  const option = { keybindSwitchScrolling: ev.target.value };
  saveOptionOnStorageWith(option).catch(onError);
  sendMessageToUpdateCommandWith(option).catch(onError);
};

const saveOptionOnStorageWith = option => {
  return browser.storage.sync.set(option);
};

const sendMessageToUpdateCommandWith = option => {
  return browser.runtime.sendMessage(option);
};

const loadAllOptionsOnStorage = () => {
  const opts = appConst.options;
  const defaultOpts = {};
  Object.keys(opts).forEach(key => {
    defaultOpts[key] = opts[key].value;
  });
  return browser.storage.sync.get(defaultOpts);
};

setupOverlayWindow();
