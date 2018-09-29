import { OptionItem, OptionHtml } from "../../../../src/modules/options";
import appConst from "../../../../src/appConst.json";

const appOpts = appConst.options;

const getOptionItemWith = typeName => {
  for (const key of Object.keys(appOpts)) {
    if (typeof appOpts[key].value !== typeName) continue;
    return new OptionItem(key, appOpts[key].value, appOpts[key].commandName);
  }
};

const getOptionHtmlWith = typeName => {
  for (const key of Object.keys(appOpts)) {
    if (typeof appOpts[key].value !== typeName) continue;
    return new OptionHtml(appOpts[key].id, appOpts[key].value);
  }
};

export { getOptionItemWith, getOptionHtmlWith };
