const createContextMenu = (props, callback) => {
  return browser.meuns.create(menu, callback);
};

const updateContextMenu = (id, props) => {
  return browser.menus.update(id, props);
};

const addOnClickListener = listener => {
  return browser.menus.onClicked(listener);
};

export { createContextMenu, updateContextMenu, addOnClickListener };
