"use strict";

import { loadOptions, initOptions } from "../../modules/options";

class OptionScript {
  constructor() {}

  init() {
    this.optionMap = initOptions(loadOptions());
  }
}

const optionScript = new OptionScript();
optionScript.init();
