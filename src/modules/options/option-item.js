import { onError } from "../utils";

class OptionItem {
  constructor(name, id, defaultValue, commandName = undefined) {
    this.name = name;
    this.id = id;
    this.defaultValue = defaultValue;
    this.commandName = commandName;
  }

  init() {
    this.loadOption().then(this.addEventListenerOnElement);
  }

  loadOption() {
    const defaultData = {};
    defaultData[this.name] = this.defaultValue;
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
    const correctType = typeof this.defaultValue;
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
    return typeof this.defaultValue === "string" ? "blur" : "change";
  }

  _getTargetValue(target) {
    const parseValueAsInt = intValue => {
      const parsedInt = parseInt(intValue);
      if (isNaN(parsedInt)) {
        throw new Error(`Cannot parse as int, ${intValue}`);
      }
      return parsedInt;
    };
    return typeof this.defaultValue === "boolean"
      ? target.checked
      : typeof this.defaultValue === "number"
        ? parseValueAsInt(target.value)
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
