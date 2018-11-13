import { createCommandObject } from '../../../../src/modules/browser/commands';

describe('commands module:', () => {
  describe('createCommandObject function:', () => {
    it('throw error when is called with no args', done => {
      try {
        createCommandObject();
      } catch (e) {
        done();
      }
    });

    it('throw error when 1st arg is not typeof string', done => {
      try {
        createCommandObject(null);
      } catch (e) {
        done();
      }
    });

    it('return obj which has name prop', () => {
      expect(createCommandObject('smell')).toEqual({ name: 'smell' });
    });

    it('return obj which has name, shortcut props', () => {
      expect(createCommandObject('good smell', 'go to restaurant')).toEqual({
        name: 'good smell',
        shortcut: 'go to restaurant'
      });
    });

    it('2nd arg is ignored when typeof is not string', () => {
      expect(createCommandObject('good smell', 123)).toEqual({
        name: 'good smell'
      });
    });

    it('return obj which has name, shortcut, description', () => {
      expect(
        createCommandObject('fireAction', 'Ctrl+Alt+Y', 'perform as click')
      ).toEqual({
        name: 'fireAction',
        shortcut: 'Ctrl+Alt+Y',
        description: 'perform as click'
      });
    });

    it('3rd arg is ignored when typeof is not string', () => {
      expect(createCommandObject('a', 'b', true)).toEqual({
        name: 'a',
        shortcut: 'b'
      });
    });
  });
});
