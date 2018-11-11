import browser from './api';

if (
  typeof browser.contextMenus === 'undefined' &&
  typeof browser.menus === 'object'
) {
  browser.contextMenus = browser.menus;
}

const createContextMenu = (props, callback) => {
  return browser.contextMenus.create(props, callback);
};

const updateContextMenu = (id, props) => {
  return browser.contextMenus.update(id, props);
};

const addOnClickListener = listener => {
  return browser.contextMenus.onClicked.addListener(listener);
};

export { createContextMenu, updateContextMenu, addOnClickListener };
