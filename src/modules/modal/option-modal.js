import appConst from "../../appConst.json";
import { OptionItem, OptionHtml, loadOptions } from "../options";

const appOpts = appConst.options;

class OptionModal {
  constructor() {}

  init() {
    this.CLASS_NAME_OPEN = "active";
    this.loadHtml();
    this.appendHtmlToBody();
    this.setOptions();
  }

  setOptions() {
    this.optionMap = loadOptions();
    for (const key of Object.keys(this.optionMap)) {
      const opt = this.optionMap[key];
      opt.item.init();
      opt.html.init();
    }
  }

  appendHtmlToBody() {
    return document.body.appendChild(this.html);
  }

  loadHtml() {
    const wrapperEle = document.createElement("div");
    wrapperEle.id = appConst.html.wrapper.id;
    wrapperEle.innerHTML = require("../../../dist/modal.html");
    this.html = wrapperEle;
  }

  open() {
    return document
      .getElementById(appConst.html.modal.id)
      .classList.add(this.CLASS_NAME_OPEN);
  }

  close() {
    return document
      .getElementById(appConst.html.modal.id)
      .classList.remove(this.CLASS_NAME_OPEN);
  }

  setOnUpdateCommandListener(l) {
    for (const key of Object.keys(this.optionMap)) {
      const opt = this.optionMap[key].item;
      if (opt.hasCommand()) opt.setOnUpdateCommandListener(l);
    }
  }
}

export default OptionModal;
