import { onError } from "../utils";
import {
  addOnChangeListenerInStorage,
  loadItemOnSyncStorage,
  saveItemOnSyncStorage,
  updateCommand,
  createCommandObject
} from "../browser";

class OptionItem {
  constructor(name, defaultValue, commandName = undefined) {
    this.name = name;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.commandName = commandName;
    this.onUpdateCommandListener = null;
    this.onLoadListener = null;
    this.onChangeListener = null;

    this.onInputChangeListener = this.onInputChangeListener.bind(this);
  }

  init() {
    this.onLoadListener = this.onLoadListener.bind(this);
    this.onChangeListener = this.onChangeListener.bind(this);
    this.onStorageChangeListener = this.onStorageChangeListener.bind(this);
    addOnChangeListenerInStorage(this.onStorageChangeListener);

    this.load();
  }

  load() {
    return loadItemOnSyncStorage({
      [this.name]: this.defaultValue
    }).then(data => {
      this.value = data[this.name];
      this.onLoadListener(this.value);
      return new Promise(resolve => {
        resolve(data[this.name]);
      });
    });
  }

  save(newValue) {
    this.assertValue(newValue);
    return saveItemOnSyncStorage({
      [this.name]: newValue
    }).then(() => {
      this.value = newValue;
      return new Promise(resolve => {
        resolve(newValue);
      });
    });
  }

  assertValue(value) {
    const correctType = typeof this.defaultValue;
    if (correctType !== typeof value) {
      throw new Error(`Typeof value should be ${correctType}`);
    }
  }

  addOnLoadListener(listener) {
    this.onLoadListener = listener;
  }

  addOnChangeListener(listener) {
    this.onChangeListener = listener;
  }

  onStorageChangeListener(changes) {
    // from storage
    if (!Object.keys(changes).includes(this.name)) return;
    const newValue = changes[this.name].newValue;
    this.value = newValue;
    if (this.hasCommand()) {
      this.updateCommandKeyBind(newValue);
    }
    this.onChangeListener(newValue);
  }

  onInputChangeListener(value) {
    return this.save(value);
  }

  hasCommand() {
    if (typeof this.commandName !== "undefined") return true;
    return false;
  }

  updateCommandKeyBind(value) {
    const cmd = createCommandObject(this.commandName, value);
    try {
      return updateCommand(cmd);
    } catch (e) {
      if (!this.onUpdateCommandListener) return;
      this.onUpdateCommandListener(cmd);
    }
  }

  setOnUpdateCommandListener(listener) {
    this.onUpdateCommandListener = listener;
  }
}

export default OptionItem;
