import browser from './api';

const typeofObject = typeof {};
const typeofString = typeof '';
const storageArea = browser.storage.sync;

// TODO: fix function name
const saveItemOnSyncStorage = item => {
  if (typeof item !== typeofObject) {
    throw new Error(
      `Typeof item must be ${typeofObject}, it is ${typeof item}`
    );
  }
  return storageArea.set(item);
};

// TODO: fix function name
const loadItemOnSyncStorage = item => {
  if (typeof item === typeofObject) {
    return storageArea.get(item);
  }
  if (typeof item === typeofString) {
    const key = item; // item is key
    const itemObj = {};
    itemObj[key] = undefined;
    return storageArea.get(itemObj);
  }
  throw new Error(
    `Typeof item must be ${typeofObject} or ${typeofString}, it is ${typeof item}`
  );
};

// TODO: fix function name
const loadAllItemsOnSyncStorage = () => {
  return storageArea.get();
};

// TODO: fix function name
const removeItemOnSyncStorage = key => {
  if (typeof key !== typeofString) {
    throw new Error(`Typeof key must be ${typeofString}, it is ${typeof key}`);
  }
  return storageArea.remove(key);
};

const removeAllItemsOnSyncStorage = () => {
  return storageArea.clear();
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
