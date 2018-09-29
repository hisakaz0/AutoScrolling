const sendMessageToBackground = msg => {
  return browser.runtime.sendMessage(msg);
};

const addOnMessageListener = listener => {
  return browser.runtime.onMessage(listener);
};

export { sendMessageToBackground, addOnMessageListener };
