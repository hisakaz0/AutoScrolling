import { OptionItem } from "../../../../src/modules/options";
import appConst from "../../../../src/appConst.json";

const opts = appConst.options;

const getOptionItemWith = typeName => {
  for (const key of Object.keys(opts)) {
    if (typeof opts[key].value !== typeName) continue;
    return new OptionItem(
      key,
      opts[key].id,
      opts[key].value,
      opts[key].commandName
    );
  }
};

export { getOptionItemWith };
