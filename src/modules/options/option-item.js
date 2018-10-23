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
    this._setOptionValue = this._setOptionValue.bind(this);
  }

  init() {
    this.loadOption();
  }

  loadOption() {
    return loadItemOnSyncStorage({
      [this.name]: this.defaultValue
    }).then(this._setOptionValue);
  }

  saveOption(newValue) {
    this.assertValue(newValue);
    return saveItemOnSyncStorage({
      [this.name]: newValue
    }).then(this._setOptionValue);
  }

  _setOptionValue(data) {
    this.value = data[this.name];
    return new Promise(resolve => {
      resolve(data[this.name]);
    });
  }

  assertValue(value) {
    const correctType = typeof this.defaultValue;
    if (correctType !== typeof value) {
      throw new Error(`Typeof value should be ${correctType}`);
    }
  }

  setOnChangeListener(listener) {
    const wrapper = chnages => {
      if (this.name in Object.keys(changes)) {
        const newValue = changes[this.name];
        this.value = value;
        if (this.hasCommand()) {
          this.updateCommandKeyBind(newValue);
        }
        listener(newValue);
      }
    };
    return addOnChangeListenerInStorage(wrapper);
  }

  hasCommand() {
    if (typeof this.commandName !== "undefined") return true;
    return false;
  }

  updateCommandKeyBind(value) {
    const cmd = createCommandObject(this.name, value);
    try {
      return updateCommand(cmd);
    } catch (e) {
      this.onUpdateCommandListener(cmd);
    }
  }

  htmlListener(value) {
    return this.saveOption(value);
  }

  setOnUpdateCommandListener(l) {
    this.onUpdateCommandListener = l;
  }
}

export default OptionItem;
