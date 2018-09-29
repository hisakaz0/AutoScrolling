const addOnClickListener = listener => {
  return browser.browserAction.onClicked.addListener(listener);
};
