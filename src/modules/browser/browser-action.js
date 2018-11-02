const addOnClickListener = listener => {
  return browser.browserAction.onClicked.addListener(listener);
};

const setTitle = text => {
  return browser.browserAction.setTitle(text);
};

export { 
  addOnClickListener,
  setTitle
};
