const typeofObject = typeof {};
const typeofString = typeof "";

const saveItemOnSyncStorage = item => {
  if (typeof item !== typeofObject) {
    throw new Error(
      `Typeof item must be ${typeofObject}, it is ${typeof item}`
    );
  }
  return browser.storage.sync.set(item);
};

const loadItemOnSyncStorage = item => {
  if (typeof item === typeofObject) {
    return browser.storage.sync.get(item);
  }
  if (typeof item === typeofString) {
    const key = item; // item is key
    const itemObj = {};
    itemObj[key] = undefined;
    return browser.storage.sync.get(itemObj);
  }
  throw new Error(
    `Typeof item must be ${typeofObject} or ${typeofString}, it is ${typeof item}`
  );
};

const loadAllItemsOnSyncStorage = () => {
  return browser.storage.sync.get();
};

const removeItemOnSyncStorage = key => {
  if (typeof key !== typeofString) {
    throw new Error(`Typeof key must be ${typeofString}, it is ${typeof key}`);
  }
  return browser.storage.sync.remove(key);
};

const removeAllItemsOnSyncStorage = () => {
  return browser.storage.sync.remove();
};

const addOnChangeListenerInStorage = l => {
  return browser.storage.onChanged.addListener(l);
};

export {
  saveItemOnSyncStorage,
  loadItemOnSyncStorage,
  loadAllItemsOnSyncStorage,
  removeItemOnSyncStorage,
  removeAllItemsOnSyncStorage,
  addOnChangeListenerInStorage
};
