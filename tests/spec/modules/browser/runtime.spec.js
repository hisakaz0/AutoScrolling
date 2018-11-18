import {
  sendMessageToBackground,
  addOnMessageListener
} from '../../../../src/modules/browser/runtime';

describe('runtime module:', () => {
  describe('sendMessageToBackground:', () => {
    it('return a promise when is called', () => {
      expect(sendMessageToBackground('string msg') instanceof Promise).toBe(
        true
      );
    });
  });

  describe('addOnMessageListener:', () => {
    it('no happend when is called with a listener arg', done => {
      const fn = () => {
        return 10;
      };
      try {
        addOnMessageListener(fn);
        done();
      } catch (e) {
        fail();
      }
    });
  });
});
