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

    this.onHtmlInputChangedListener = this.onHtmlInputChangedListener.bind(
      this
    );
  }

  init() {
    this.onLoadListener = this.onLoadListener.bind(this);
    this.onChangeListenerFromHtml = this.onChangeListenerFromHtml.bind(this);
    this.onChangeListener = this.onChangeListener.bind(this);
    addOnChangeListenerInStorage(this.onChangeListener);

    this.loadOption();
  }

  loadOption() {
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

  saveOption(newValue) {
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

  addOnChangeListenerFromHtml(listener) {
    this.onChangeListenerFromHtml = listener;
  }

  onChangeListener(changes) {
    // from storage
    if (Object.keys(changes).includes(this.name)) {
      const newValue = changes[this.name].newValue;
      this.value = newValue;
      if (this.hasCommand()) {
        this.updateCommandKeyBind(newValue);
      }
      this.onChangeListenerFromHtml(newValue);
    }
  }

  onHtmlInputChangedListener(value) {
    return this.saveOption(value);
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

  setOnUpdateCommandListener(l) {
    this.onUpdateCommandListener = l;
  }
}

export default OptionItem;
