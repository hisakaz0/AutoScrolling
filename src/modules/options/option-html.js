class OptionHtml {
  constructor(id, defaultValue) {
    this.id = id;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  init() {}

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

  addEventListener(listener) {
    const wrapper = ev => {
      listener(this._getTargetValue(ev.target));
    };
    this.getElement().addEventListener(this._getListenerType(), wrapper);
  }

  handleOnChangeStorage(value) {
    this.value = value;
    this.setValueOnElement();
  }

  handleOnLoadStorage(value) {
    this.value = value;
    this.setValueOnElement();
  }
}

export default OptionHtml;
