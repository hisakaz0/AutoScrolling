import { OptionItem, OptionHtml } from "./index";
import appConst from "../../appConst.json";

const appOpts = appConst.options;

const loadOptions = () => {
  const map = {};
  Object.keys(appOpts).map(key => {
    const value = appOpts[key].value;
    const optItem = new OptionItem(key, value, appOpts[key].commandName);
    const optHtml = new OptionHtml(appOpts[key].id, value);
    optItem.setOnChangeListener(optHtml.storageListener);
    optHtml.addEventListener(optItem.htmlListener);
    map[key] = { item: optItem, html: optHtml };
  });
  return map;
};

const loadOptionItems = () => {
  const map = {};
  Object.keys(appOpts).map(key => {
    const opt = new OptionItem(
      key,
      appOpts[key].value,
      appOpts[key].commandName
    );
    map[key] = opt;
  });
  return map;
};

export { loadOptions, loadOptionItems };
