import browser from './api';

const isChrome = () => typeof browser.contextMenus === 'object'
  && typeof browser.menus === 'undefined';

if (isChrome()) {
  browser.menus = browser.contextMenus;
}

const createContextMenu = (props, callback) => browser.menus.create(props, callback);

const updateContextMenu = (id, props) => browser.menus.update(id, props);

const addOnClickListener = listener => browser.menus.onClicked.addListener(listener);

export { createContextMenu, updateContextMenu, addOnClickListener };
