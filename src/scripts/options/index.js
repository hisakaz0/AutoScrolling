import { loadOptions, initOptions } from "../../modules/options";

class OptionScript {
  constructor() {
    this.options = null;
  }

  init() {
    this.options = initOptions(loadOptions());
  }
}

const script = new OptionScript();
script.init();
