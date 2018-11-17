import {
  isSystemProtocol,
  isFunction,
  isValidTimerId,
  INVALID_TIMER_ID
} from '../../../../src/modules/utils/util';

describe('util module:', () => {
  describe('isSystemProtocol:', () => {
    it('return true when a string is start with \'about:\'', () => {
      expect(isSystemProtocol('about:')).toBe(true);
    });

    it('return false when a string is start with \'http:\'', () => {
      expect(isSystemProtocol('http:')).toBe(false);
    });
  });

  describe('isFunction:', () => {
    it('return true when the arg is function', () => {
      const fn = () => {
        return 5;
      };
      expect(isFunction(fn)).toBe(true);
    });

    it('return false when the arg is object', () => {
      expect(isFunction({})).toBe(false);
    });
  });

  describe('isValidTimerId:', () => {
    it('return true when id is not INVALID_TIMER_ID', () => {
      expect(isValidTimerId(1)).toBe(true);
    });

    it('return false when id is INVALID_TIMER_ID', () => {
      expect(isValidTimerId(INVALID_TIMER_ID)).toBe(false);
    });
  });
});
