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
