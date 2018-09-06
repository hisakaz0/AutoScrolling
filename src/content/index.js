'use strict';

import { onError } from '../utils';

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
  scrollingSpeed: 50,
  stopScrollingByClick: true,
  stopScrollingOnHover: false
};

let autoScrolling = Object.assign({}, defaultValues, {
  scrollingAction: function() {
    if (this.stopScrollingOnHover && this.currentlyHovering) {
      return;
    }
    this.y = this.y + this.scrollingStep;
    this.scrollingElement.scroll(this.x, this.y);
  },
  start: function() {
    this.scrollingElement = getScrollingElement();
    removeMouseListeners();
    addMouseListeners();
    this.intervalId = window.setInterval(
      this.scrollingAction.bind(this),
      100 - this.scrollingSpeed
    );
  },
  stop: function() {
    removeMouseListeners();
    window.clearInterval(this.intervalId);
  }
});

const updateFromSync = () => {
  const {
    scrollingStep,
    scrollingSpeed,
    stopScrollingByClick,
    stopScrollingOnHover
  } = defaultValues;

  browser.storage.sync
    .get({
      scrollingStep,
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
  document.body.addEventListener('mouseover', mouseoverListeners);
  document.body.addEventListener('mouseout', mouseoutListeners);
  document.body.addEventListener('click', clickListeners);
};

const removeMouseListeners = () => {
  document.body.removeEventListener('mouseover', mouseoverListeners);
  document.body.removeEventListener('mouseout', mouseoutListeners);
  document.body.removeEventListener('click', clickListeners);
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
        return setOnOptionWindowWith(options);
      })
      .then(() => {
        openOverlay();
      })
      .catch(onError);
  }
});

const setOnOptionWindowWith = options => {
  return setValueOnInput(
    'auto-scrolling-overlay-scrolling-speed',
    options.scrollingSpeed)
    .then(() => {
      return setValueOnInput(
        'auto-scrolling-overlay-stop-scrolling-by-click',
        options.stopScrollingByClick)
    })
    .then(() => {
      return setValueOnInput(
        'stop-scrolling-on-hover',
        options.stopScrollingOnHover)
    })
    .then(() => {
      return setValueOnInput(
        'kb-shortcut-toggle-current-tab',
        options["toggle-scrolling-state"])
    });
};

const setValueOnInput = (id, value) => {
  return new Promise(resolve => {
    document.getElementById(id).value = value;
    resolve();
  });
};

browser.storage.onChanged.addListener(changes => {
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

// Autoscrolling Overlay
const openOverlay = () => {
  document.getElementById('modal-auto-scrolling')
    .classList.add('active');
};

const closeOverlay = () => {
  document.getElementById('modal-auto-scrolling')
    .classList.remove('active');
};

const setScrollingSpeed = ev => {
  let scrollingSpeed = ev.target.value;
  if (scrollingSpeed > 100) {
    scrollingSpeed = 99;
  } else if (scrollingSpeed < 0) {
    scrollingSpeed = 1;
  }
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
    .then(() => { closeOverlay(); })
    .catch(onError);
};

function insertOverlayElement () {
  let overlayEle = document.createElement('div');
  overlayEle.id = 'auto-scrolling';
  overlayEle.innerHTML = require('html-loader!./index.html');
  return new Promise(resolve => {
    resolve(document.body.appendChild(overlayEle));
  });
};

function setupOverlayWindow () {
  insertOverlayElement().then(setEvetListeners);
};

function setEvetListeners (parent) {
  document.querySelectorAll('[data-modal-auto-scrolling]')
    .forEach(ele => {
      ele.addEventListener('click', sendMessageCloseModal)
    });
  document.getElementById('auto-scrolling-overlay-scrolling-speed')
    .addEventListener('change', setScrollingSpeed);
  document.getElementById('auto-scrolling-overlay-stop-scrolling-by-click')
    .addEventListener('change', setStopScrollingByClick);
  document.getElementById("stop-scrolling-on-hover")
    .addEventListener('change', listenerOnChangeStopScrollingOnHover);
  document.getElementById("kb-shortcut-toggle-current-tab")
    .addEventListener('change', listenerOnChangeKbShortcutToggleCurrentTab);
}

const listenerOnChangeStopScrollingOnHover = ev => {
  const newValue = ev.target.checked;
  autoScrolling.stopScrollingOnHover = newValue;
  saveOptionOnStorageWith({ stopScrollingOnHover: newValue })
    .catch(onError);
};

const listenerOnChangeKbShortcutToggleCurrentTab = ev => {
  const option = { "toggle-scrolling-state": ev.target.value };
  saveOptionOnStorageWith(option)
    .catch(onError);
  sendMessageToUpdateCommandWith(option)
    .catch(onError);
};

const saveOptionOnStorageWith = option => {
  return browser.storage.sync.set(option);
}

const sendMessageToUpdateCommandWith = option => {
  return browser.runtime.sendMessage(option);
};

const loadAllOptionsOnStorage = () => {
  return browser.storage.sync.get();
};

setupOverlayWindow();
