import { onError } from "../utils";

class OptionItem {

  constructor(name, id, defalutValue, commandName = undefined) {
    this.name = name;
    this.id = id;
    this.defalutValue = defalutValue
    this.commandName = commandName;

    this.loadOption()
      .then(this.addEventListenerOnElement);
  }

  loadOption() {
    const defaultData = {};
    defaultData[this.name] = this.defalutValue;
    return browser.storage.sync
      .get(defaultData)
      .then(this._setOptionValue);
  }

  saveOption(newValue) {
    this.assertValue(newValue);
    const saveData = {};
    saveData[this.name] = newValue;
    return browser.storage.sync
      .set(saveData)
      .then(this._setOptionValue);
  }

  _setOptionValue (data) {
    this.value = data[this.name];
    return new Promise(resolve => {
      resolve(data[this.name]);
    });
  }

  assertValue(value) {
    const correctType = typeof this.defalutValue;
    if (correctType !== typeof value)  {
      throw new Error(`Typeof value should be ${correctType}`);
    }
  }

  hasCommand() {
    if (typeof this.commandName !== 'undefined') return true;
    return false;
  }

  updateCommandKeyBind() {
    const keybind = { name: this.name, shortcut: this.value };
    return browser.commands.update(keybind);
  }

  setValueOnElement() {
    const ele = document.getElementById(this.id)
    if (typeof this.value === 'number') {
      ele.value = parseInt(this.value);
    } else if (typeof this.value === 'boolean') {
      ele.checked = this.value;
    } else if (typeof this.value === 'string') {
      ele.value = this.value;
    }
  }

  addEventListenerOnElement() {
    const type = typeof this.defalutValue === 'string' ? 'blur' : 'change';
    const listener = (ev) => {
      const newValue = 
        typeof this.defalutValue === 'boolean' ? ev.target.checked :
        typeof this.defalutValue === 'number' ? parseInt(ev.target.value) :
        ev.target.value;
      this.saveOption(newValue)
        .then(savedValue => {
          if (this.hasCommand()) this.updateCommandKeyBind();
        })
        .catch(onError);
    };
    document.getElementById(this.id).addEventListener(type, listener);
  }
}

export default OptionItem;