import {
  addOnClickListener,
  setTitle,
  setBadgeText,
  setIcon
} from '../../../../src/modules/browser/browser-action';

describe('browser-action module:', () => {
  describe('addOnClickListener:', () => {
    it('no happen when listener is fed', done => {
      const fn = () => 2;
      try {
        addOnClickListener(fn);
        done();
      } catch (e) {
        fail();
      }
    });
  });

  describe('setTitle:', () => {
    it('return a promise when is called with args', () => {
      expect(setTitle('title of mine', 5) instanceof Promise).toBe(true);
    });
  });

  describe('setBadgeText:', () => {
    it('return a promise when is called with args', () => {
      expect(setBadgeText('text of badge', 10) instanceof Promise).toBe(true);
    });
  });

  describe('setIcon:', () => {
    it('return a promise when is called with args', () => {
      expect(setIcon(['path/to/icon.png'], 10) instanceof Promise).toBe(true);
    });
  });
});
