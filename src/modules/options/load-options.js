import { OptionItem, OptionHtml } from './index';
import appConst from '../../appConst.json';

const appOpts = appConst.options;

const loadOptions = () => {
  const map = {};
  Object.keys(appOpts).map(key => {
    const value = appOpts[key].value;
    const optItem = new OptionItem(key, value, appOpts[key].commandName);
    const optHtml = new OptionHtml(appOpts[key].id, value);
    map[key] = { item: optItem, html: optHtml };
  });
  return map;
};

const initOptions = opts => {
  for (const key of Object.keys(opts)) {
    const opt = opts[key];
    opt.item.addOnChangeListener(opt.html.onChangeStorageListener);
    opt.item.addOnLoadListener(opt.html.onLoadStorageListener);
    opt.html.addOnChangeListener(opt.item.onInputChangeListener);
    opt.item.init();
    opt.html.init();
  }
  return opts;
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

export { loadOptions, initOptions, loadOptionItems };
