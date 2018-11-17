import { isValidWindowId } from '../../../../src/modules/browser/windows';
import api from 'sinon-chrome';

describe('windows module:', () => {
  describe('isValidWindowId function', () => {
    it('return false when is fed undefined', () => {
      expect(isValidWindowId()).toBe(false);
    });

    it('return false when is fed null', () => {
      expect(isValidWindowId(null)).toBe(false);
    });

    it('return false when is fed WINDOW_ID_NONE', () => {
      expect(isValidWindowId(api.windows.WINDOW_ID_NONE)).toBe(false);
    });

    it('return true when is fed number exclude WINDOW_ID_NONE', () => {
      expect(isValidWindowId(1)).toBe(true);
    });
  });
});
