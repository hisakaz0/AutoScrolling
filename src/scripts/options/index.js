"use strict";

import { loadOptions } from "../../modules/options";

class OptionScript {
  constructor() {}

  init() {
    this.optionMap = loadOptions();
    for (const key of Object.keys(this.optionMap)) {
      const opt = this.optionMap[key];
      opt.item.init();
      opt.html.init();
    }
  }
}

const optionScript = new OptionScript();
optionScript.init();
