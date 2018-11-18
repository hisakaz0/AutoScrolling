import {
  createContextMenu,
  updateContextMenu,
  addOnClickListener
} from '../../../../src/modules/browser/menus';

const menuObj = {
  id: 'action-menu',
  title: 'Start scrolling',
  contexts: ['all']
};

xdescribe('menus module:', () => {
  describe('createContextMenu:', () => {
    it('return a promise when is called with obj', () => {
      const ret = createContextMenu(menuObj);
      expect(ret).toBe({});
      expect(createContextMenu(menuObj) instanceof Promise).toBe(true);
    });
  });

  describe('updateContextMenu:', () => {
    it('return a promise when is called with args', () => {
      expect(
        updateContextMenu(menuObj.id, {
          title: 'Stop scrolling'
        }) instanceof Promise
      ).toBe(true);
    });
  });

  describe('addOnClickListener', () => {
    it('no happen when is called with a listener arg', done => {
      const fn = () => {
        return 'return value';
      };
      try {
        addOnClickListener(fn);
        done();
      } catch (e) {
        fail();
      }
    });
  });
});
