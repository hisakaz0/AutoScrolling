import { getTab } from '../browser/index';
import { isSystemProtocol } from './util';

const isNotSystemTabWith = tabId => getTab(tabId).then((tab) => {
  if (isSystemProtocol(tab.url)) return Promise.reject();
  return Promise.resolve();
});

export default isNotSystemTabWith;
