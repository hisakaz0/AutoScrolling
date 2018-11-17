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
    this.setPresetScrollingSection();
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
    return document.querySelectorAll(`[${appConst.modal.closeAttribute}]`);
  }

  onCloseButtonClickListener(ev) {
    this.close();
    this.onCloseListener();
  }

  setPresetScrollingSection() {
    this.togglePresetSection = this.togglePresetSection.bind(this);
    const presetOpt = this.options.enablePresetsOfScrollingSpeed.item;

    presetOpt.addOnChangeListener(this.togglePresetSection);
    this.togglePresetSection(presetOpt.value);
  }

  togglePresetSection(isEnabledPreset) {
    const presetsWrapper = appConst.html.presetsWrapper.id;
    const speedWrapper = appConst.html.speedWrapper.id;
    if (isEnabledPreset === true) {
      showHtml(presetsWrapper);
      hideHtml(speedWrapper);
    } else {
      hideHtml(presetsWrapper);
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
    this.togglePresetSection(
      this.options.enablePresetsOfScrollingSpeed.item.value
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
