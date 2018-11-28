import OptionItem from './option-item';
import OptionHtml from './option-html';
import appConst from '../../appConst.json';

const fromEntries = Object.fromEntries
  ? Object.fromEntries
  : require('object.fromentries');

const appOpts = appConst.options;

const loadOptions = () => fromEntries(
  Object.entries(appOpts).map(([key, val]) => {
    const item = new OptionItem(key, val.value, val.commandName);
    const html = new OptionHtml(val.id, val.value);
    return [key, { item, html }];
  }),
);

const initOptions = opts => fromEntries(
  Object.entries(opts).map(([id, opt]) => {
    const { item, html } = opt;
    item.addOnChangeListener(html.onChangeStorageListener)
      .addOnLoadListener(html.onLoadStorageListener);
    html.addOnChangeListener(item.onInputChangeListener);
    item.init();
    return [id, { item, html }];
  }),
);

const loadOptionItems = () => fromEntries(
  Object.entries(appOpts).map(([key, val]) => [
    key,
    new OptionItem(key, val.value, val.commandName),
  ]),
);

const initOptionItems = opts => fromEntries(
  Object.entries(opts).map(([key, opt]) => [key, opt.init()]),
);

export {
  loadOptions, initOptions, loadOptionItems, initOptionItems,
};
