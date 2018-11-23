import browser from './api';

const sendMessageToBackground = msg => browser.runtime.sendMessage(msg);

const addOnMessageListener = listener => browser.runtime.onMessage.addListener(listener);

export { sendMessageToBackground, addOnMessageListener };
