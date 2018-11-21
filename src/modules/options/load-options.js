import OptionItem from './option-item';
import OptionHtml from './option-html';
import appConst from '../../appConst.json';

const appOpts = appConst.options;

const loadOptions = () => Object.fromEntries(
  Object.entries(appOpts).map(([key, val]) => {
    const item = new OptionItem(key, val.value, val.commandName);
    const html = new OptionHtml(val.id, val.value);
    return [key, { item, html }];
  }),
);

const initOptions = opts => Object.fromEntries(
  Object.entries(opts).map(([id, opt]) => {
    const { item, html } = opt;
    item.addOnChangeListener(html.onChangeStorageListener)
      .addOnLoadListener(html.onLoadStorageListener);
    html.addOnChangeListener(item.onInputChangeListener);
    item.init();
    return [id, { item, html }];
  }),
);

const loadOptionItems = () => Object.fromEntries(
  Object.entries(appOpts).map(([key, val]) => [
    key,
    new OptionItem(key, val.value, val.commandName),
  ]),
);

const initOptionItems = opts => Object.fromEntries(
  Object.entries(opts).map(([key, opt]) => [key, opt.init()]),
);

export {
  loadOptions, initOptions, loadOptionItems, initOptionItems,
};
