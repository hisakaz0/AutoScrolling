"use strict";

import appConst from "../../appConst.json";
import { OptionItem } from "../../modules/options";

class OptionScript {
  constructor() {}

  setup() {
    const appOpts = appConst.options;
    this.optionList = [];
    Object.keys(appOpts).map(key => {
      const opt = new OptionItem(
        key,
        appOpts[key].id,
        appOpts[key].value,
        appOpts[key].commandName
      );
      opt.init();
      this.optionList.push(opt);
    });
  }
}

const optionScript = new OptionScript();
optionScript.setup();
