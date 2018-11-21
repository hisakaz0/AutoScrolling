import browser from './api';

const getAllWindow = () => browser.windows.getAll();

const addOnCreatedListener = listener => browser.windows.onCreated.addListener(listener);

const addOnRemovedListener = listener => browser.windows.onRemoved.addListener(listener);

const addOnFocusChangedListener = listener => browser.windows.onFocusChanged.addListener(listener);

const isValidWindowId = id => (
  id !== null
  && id !== browser.windows.WINDOW_ID_NONE
);

export {
  getAllWindow,
  addOnCreatedListener,
  addOnRemovedListener,
  addOnFocusChangedListener,
  isValidWindowId,
};
