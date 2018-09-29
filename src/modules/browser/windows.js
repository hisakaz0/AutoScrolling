const getAllWindow = () => {
  return browser.windows.getAll();
};

const addOnCreatedListener = listener => {
  return browser.windows.onCreated.addListener(listener);
};

const addOnRemovedListener = listener => {
  return browser.windows.onRemoved.addListener(listener);
};
