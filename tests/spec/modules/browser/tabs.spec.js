import { isValidTabId } from '../../../../src/modules/browser/tabs';
import api from 'sinon-chrome';

describe('tabs module:', () => {
  describe('isValidTabId function', () => {
    it('return false when is fed undefined', () => {
      expect(isValidTabId()).toBe(false);
    });

    it('return false when is fed null', () => {
      expect(isValidTabId(null)).toBe(false);
    });

    it('return false when is fed TAB_ID_NONE', () => {
      expect(isValidTabId(api.windows.TAB_ID_NONE)).toBe(false);
    });

    it('return true when is fed number exclude TAB_ID_NONE', () => {
      expect(isValidTabId(1)).toBe(true);
    });
  });
});
