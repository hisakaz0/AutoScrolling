import browser from './api';

const storageArea = browser.storage.sync;

const saveItemOnStorage = (item) => {
  if (typeof item !== typeof {}) {
    throw new Error(`Typeof item must be object, it is ${typeof item}`);
  }
  return storageArea.set(item);
};

const loadItemOnStorage = (item) => {
  if (typeof item === typeof {}) return storageArea.get(item);
  if (typeof item === typeof '') {
    const key = item; // item is key
    const itemObj = {};
    itemObj[key] = undefined;
    return storageArea.get(itemObj);
  }
  throw new Error(`Typeof item must be object or string, it is ${typeof item}`);
};

const loadAllItemsOnStorage = () => storageArea.get();

const removeItemOnStorage = (key) => {
  if (typeof key !== typeof '') {
    throw new Error(`Typeof key must be string, it is ${typeof key}`);
  }
  return storageArea.remove(key);
};

const clearOnStorage = () => storageArea.clear();

const addOnStorageChangeListener = listener => browser.storage.onChanged.addListener(listener);

export {
  saveItemOnStorage,
  loadItemOnStorage,
  loadAllItemsOnStorage,
  removeItemOnStorage,
  clearOnStorage,
  addOnStorageChangeListener,
};
