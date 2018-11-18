import appConst from '../../appConst.json';
import { loadOptions, initOptions } from '../options';
import { appendHtmlText, showHtml, hideHtml } from '../utils';

class OptionModal {
  constructor() {
    this.CLASS_NAME_OPEN = 'active';
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
    this.setTransmissionSection();
  }

  setOptions() {
    this.options = initOptions(loadOptions());
  }

  setOnCloseButtonClickListener() {
    return this.getCloseEles().forEach(ele => {
      ele.addEventListener('click', this.onCloseButtonClickListener);
    });
  }

  getCloseEles() {
    return document.querySelectorAll(`[${appConst.html.modal.closeAttribute}]`);
  }

  onCloseButtonClickListener(ev) {
    this.close();
    this.onCloseListener();
  }

  setTransmissionSection() {
    this.toggleTransmissionSection = this.toggleTransmissionSection.bind(this);
    const transmissionOpt = this.options.enableTransmissionScrolling.item;

    transmissionOpt.addOnChangeListener(this.toggleTransmissionSection);
    this.toggleTransmissionSection(transmissionOpt.value);
  }

  toggleTransmissionSection(isEnabledTransmission) {
    const transmissionWrapper = appConst.html.transmissionWrapper.id;
    const speedWrapper = appConst.html.speedWrapper.id;
    if (isEnabledTransmission === true) {
      showHtml(transmissionWrapper);
      hideHtml(speedWrapper);
    } else {
      hideHtml(transmissionWrapper);
      showHtml(speedWrapper);
    }
  }

  setOnCloseListener(listener) {
    this.onCloseListener = listener.bind(this);
  }

  appendHtmlToBody() {
    return document.body.appendChild(this.html);
  }

  loadHtml() {
    const wrapperEle = document.createElement('div');
    wrapperEle.id = appConst.html.wrapper.id;
    appendHtmlText(wrapperEle, require('../../../addon/dist/modal.html'));
    this.html = wrapperEle;
  }

  open() {
    this.toggleTransmissionSection(
      this.options.enableTransmissionScrolling.item.value
    );
    document
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
