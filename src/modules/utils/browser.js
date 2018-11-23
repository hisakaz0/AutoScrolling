import { getTab } from '../browser/index';
import { isSystemProtocol } from './util';

const isNotSystemTabWith = tabId => getTab(tabId).then(tab => new Promise((resolve, reject) => {
  if (isSystemProtocol(tab.url)) {
    reject(new Error(`Provided url seems like system: ${tab.url}`));
  } else {
    resolve(true);
  }
}));

export default isNotSystemTabWith;
