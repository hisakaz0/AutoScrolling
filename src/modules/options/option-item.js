import {
  addOnStorageChangeListener,
  loadItemOnStorage,
  saveItemOnStorage,
  updateCommand,
  createCommandObject,
} from '../browser';

class OptionItem {
  constructor(name, defaultValue, commandName = undefined) {
    this.name = name;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.commandName = commandName;
    this.onUpdateCommandListener = null;
    this.onLoadListener = null;
    this.onChangeListeners = [];

    this.onInputChangeListener = this.onInputChangeListener.bind(this);
    this.onStorageChangeListener = this.onStorageChangeListener.bind(this);
  }

  init() {
    addOnStorageChangeListener(this.onStorageChangeListener);
    this.load();
    return this;
  }

  load() {
    return loadItemOnStorage({
      [this.name]: this.defaultValue,
    }).then((data) => {
      this.value = data[this.name];
      if (this.onLoadListener !== null) this.onLoadListener(this.value);
      return Promise.resolve(data[this.name]);
    });
  }

  save(newValue) {
    this.assertValue(newValue);
    return saveItemOnStorage({
      [this.name]: newValue,
    }).then(() => {
      this.value = newValue;
      return Promise.resolve(newValue);
    });
  }

  assertValue(value) {
    if (typeof this.defaultValue !== typeof value) {
      throw new Error(`Typeof value should be ${typeof this.defaultValue}`);
    }
  }

  addOnLoadListener(listener) {
    this.onLoadListener = listener.bind(this);
    return this;
  }

  addOnChangeListener(listener) {
    this.onChangeListeners.push(listener.bind(this));
    return this;
  }

  onStorageChangeListener(changes) {
    // from storage
    if (!Object.keys(changes).includes(this.name)) return;
    const { newValue } = changes[this.name];
    this.value = newValue;
    if (this.hasCommand()) this.updateCommandKeyBind(newValue);
    this.onChangeListeners.forEach(func => func(newValue));
  }

  onInputChangeListener(value) {
    return this.save(value);
  }

  hasCommand() {
    return typeof this.commandName !== 'undefined';
  }

  updateCommandKeyBind(value) {
    const cmd = createCommandObject(this.commandName, value);
    try {
      return updateCommand(cmd);
    } catch (e) {
      if (!this.onUpdateCommandListener) return Promise.reject();
      return this.onUpdateCommandListener(cmd);
    }
  }

  setOnUpdateCommandListener(listener) {
    this.onUpdateCommandListener = listener.bind(this);
    return this;
  }
}

export default OptionItem;
