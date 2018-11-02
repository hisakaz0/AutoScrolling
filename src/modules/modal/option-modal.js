import appConst from "../../appConst.json";
import { OptionItem, OptionHtml, loadOptions, initOptions } from "../options";

const appOpts = appConst.options;

class OptionModal {
  constructor() {
    this.CLASS_NAME_OPEN = "active";
    this.options = null;
    this.onCloseListener = null;
    this.html = null;

    this.onCloseButtonClickListener = this.onCloseButtonClickListener.bind(
      this
    );
  }

  init() {
    this.loadHtml();
    this.appendHtmlToBody();
    this.setOptions();
    this.setOnCloseButtonClickListener();
  }

  setOptions() {
    this.options = initOptions(loadOptions());
  }

  setOnCloseButtonClickListener() {
    document
      .querySelectorAll("[data-close-modal-auto-scrolling]")
      .forEach(ele => {
        ele.addEventListener("click", this.onCloseButtonClickListener);
      });
  }

  onCloseButtonClickListener(ev) {
    this.close();
    this.onCloseListener();
  }

  setOnCloseListener(listener) {
    this.onCloseListener = listener;
  }

  appendHtmlToBody() {
    return document.body.appendChild(this.html);
  }

  loadHtml() {
    const wrapperEle = document.createElement("div");
    wrapperEle.id = appConst.html.wrapper.id;
    wrapperEle.insertAdjacentHTML(
      "afterbegin",
      require("../../../dist/modal.html")
    );
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

  setOnUpdateCommandListener(listener) {
    for (const key of Object.keys(this.options)) {
      const opt = this.options[key].item;
      if (opt.hasCommand()) opt.setOnUpdateCommandListener(listener);
    }
  }
}

export default OptionModal;
