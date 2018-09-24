import { onError } from "../utils";

class OptionItem {
  constructor(name, id, defalutValue, commandName = undefined) {
    this.name = name;
    this.id = id;
    this.defalutValue = defalutValue;
    this.commandName = commandName;
  }

  init() {
    this.loadOption().then(this.addEventListenerOnElement);
  }

  loadOption() {
    const defaultData = {};
    defaultData[this.name] = this.defalutValue;
    return browser.storage.sync.get(defaultData).then(this._setOptionValue);
  }

  saveOption(newValue) {
    this.assertValue(newValue);
    const saveData = {};
    saveData[this.name] = newValue;
    return browser.storage.sync.set(saveData).then(this._setOptionValue);
  }

  _setOptionValue(data) {
    this.value = data[this.name];
    return new Promise(resolve => {
      resolve(data[this.name]);
    });
  }

  assertValue(value) {
    const correctType = typeof this.defalutValue;
    if (correctType !== typeof value) {
      throw new Error(`Typeof value should be ${correctType}`);
    }
  }

  hasCommand() {
    if (typeof this.commandName !== "undefined") return true;
    return false;
  }

  updateCommandKeyBind() {
    const keybind = { name: this.name, shortcut: this.value };
    return browser.commands.update(keybind);
  }

  getElement() {
    return document.getElementById(this.id);
  }

  setValueOnElement() {
    const ele = this.getElement();
    if (typeof this.value === "number") {
      ele.value = parseInt(this.value);
    } else if (typeof this.value === "boolean") {
      ele.checked = this.value;
    } else if (typeof this.value === "string") {
      ele.value = this.value;
    }
  }

  _getListenerType() {
    return typeof this.defalutValue === "string" ? "blur" : "change";
  }

  _getTargetValue(target) {
    return typeof this.defalutValue === "boolean"
      ? target.checked
      : typeof this.defalutValue === "number"
        ? parseInt(target.value)
        : target.value;
  }

  addEventListenerOnElement() {
    const listener = ev => {
      this.saveOption(this._getTargetValue(ev.target))
        .then(savedValue => {
          if (this.hasCommand()) this.updateCommandKeyBind();
        })
        .catch(onError);
    };
    this.getElement().addEventListener(_getListenerType(), listener);
  }
}

export default OptionItem;
