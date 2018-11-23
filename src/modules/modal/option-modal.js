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
      this,
    );
  }

  init() {
    this.loadHtml()
      .appendHtmlToBody()
      .setOptions()
      .setOnCloseButtonClickListener()
      .setTransmissionSection();
  }

  setOptions() {
    this.options = initOptions(loadOptions());
    return this;
  }

  setOnCloseButtonClickListener() {
    this.getCloseEles().forEach((ele) => {
      ele.addEventListener('click', this.onCloseButtonClickListener);
    });
    return this;
  }

  static getCloseEles() {
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
    return this;
  }

  static toggleTransmissionSection(isEnabledTransmission) {
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
    document.body.appendChild(this.html);
    return this;
  }

  loadHtml() {
    const wrapperEle = document.createElement('div');
    wrapperEle.id = appConst.html.wrapper.id;
    // eslint-disable-next-line global-require
    appendHtmlText(wrapperEle, require('../../../addon/dist/modal.html'));
    this.html = wrapperEle;
    return this;
  }

  open() {
    this.toggleTransmissionSection(
      this.options.enableTransmissionScrolling.item.value,
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
    Object.values(this.options)
      .map(opt => opt.item)
      .forEach((item) => {
        if (item.hasCommand()) item.setOnUpdateCommandListener(listener);
      });
  }
}

export default OptionModal;
