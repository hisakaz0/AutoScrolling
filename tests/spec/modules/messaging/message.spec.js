import { addData, create } from '../../../../src/modules/messaging';

describe('message modules:', () => {
  describe('addData function:', () => {
    it('return obj has data props which Number', () => {
      expect(addData({}, 1)).toEqual({ data: 1 });
    });

    it('return has data props which Object', () => {
      const data = { a: 1, b: 2 };
      const expected = { data: data };
      expect(addData({}, data)).toEqual(expected);
    });
  });

  describe('create function:', () => {
    it('return has obj which has key of \'action\'', () => {
      const name = 'heal_damage';
      expect(create('heal_damage')).toEqual({ action: name });
    });
  });
});
