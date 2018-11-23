class OptionHtml {
  constructor(id, defaultValue) {
    this.id = id;
    this.value = defaultValue;
    this.defaultValue = defaultValue;

    this.onChangeStorageListener = this.onChangeStorageListener.bind(this);
    this.onLoadStorageListener = this.onLoadStorageListener.bind(this);
  }

  getElement() {
    return document.getElementById(this.id);
  }

  setValueOnElement() {
    const ele = this.getElement();
    if (typeof this.value === typeof 0) ele.value = Number(this.value);
    else if (typeof this.value === typeof true) ele.checked = this.value;
    else if (typeof this.value === typeof '') ele.value = this.value;
  }

  getListenerType() {
    return typeof this.defaultValue === typeof '' ? 'blur' : 'change';
  }

  getTargetValue(target) {
    const parseValueAsInt = (intValue) => {
      const num = Number(intValue);
      if (Number.isNaN(num)) throw new Error(`Cannot parse as int, ${intValue}`);
      return num;
    };
    const { checked, value } = target;
    if (typeof this.defaultValue === typeof true) return checked;
    if (typeof this.defaultValue === typeof 0) return parseValueAsInt(value);
    return value;
  }

  addOnChangeListener(listener) {
    const wrapper = (ev) => {
      listener(this.getTargetValue(ev.target));
    };
    this.getElement().addEventListener(this.getListenerType(), wrapper);
  }

  onChangeStorageListener(value) {
    this.value = value;
    this.setValueOnElement();
  }

  onLoadStorageListener(value) {
    this.value = value;
    this.setValueOnElement();
  }
}

export default OptionHtml;
