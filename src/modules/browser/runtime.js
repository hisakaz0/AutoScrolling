import browser from './api';

const sendMessageToBackground = msg => {
  return browser.runtime.sendMessage(msg);
};

const addOnMessageListener = listener => {
  return browser.runtime.onMessage.addListener(listener);
};

export { sendMessageToBackground, addOnMessageListener };
