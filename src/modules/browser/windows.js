import browser from './api';

const getAllWindow = () => {
  return browser.windows.getAll();
};

const addOnCreatedListener = listener => {
  return browser.windows.onCreated.addListener(listener);
};

const addOnRemovedListener = listener => {
  return browser.windows.onRemoved.addListener(listener);
};

const addOnFocusChangedListener = listener => {
  return browser.windows.onFocusChanged.addListener(listener);
};

const isValidWindowId = id => {
  return (
    id !== undefined && id !== null && id !== browser.windows.WINDOW_ID_NONE
  );
};

export {
  getAllWindow,
  addOnCreatedListener,
  addOnRemovedListener,
  addOnFocusChangedListener,
  isValidWindowId
};
