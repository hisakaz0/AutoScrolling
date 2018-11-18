import browser from './api';

const isChrome = () => {
  return (
    typeof browser.contextMenus === 'object' &&
    typeof browser.menus === 'undefined'
  );
};

if (isChrome()) {
  browser.menus = browser.contextMenus;
}

const createContextMenu = (props, callback) => {
  return browser.menus.create(props, callback);
};

const updateContextMenu = (id, props) => {
  return browser.menus.update(id, props);
};

const addOnClickListener = listener => {
  return browser.menus.onClicked.addListener(listener);
};

export { createContextMenu, updateContextMenu, addOnClickListener };
