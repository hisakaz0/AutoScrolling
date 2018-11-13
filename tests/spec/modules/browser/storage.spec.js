import {
  saveItemOnSyncStorage,
  loadItemOnSyncStorage,
  loadAllItemsOnSyncStorage,
  removeItemOnSyncStorage,
  removeAllItemsOnSyncStorage,
  addOnChangeListenerInStorage
} from '../../../../src/modules/browser/storage';

describe('storage module', () => {
  describe('saveItemOnSyncStorage:', () => {
    it('throw a error when arg is not typeof object', done => {
      try {
        saveItemOnSyncStorage(1);
      } catch (e) {
        done();
      }
    });

    it('return promise when api is called', () => {
      expect(saveItemOnSyncStorage({ name: 'api' }) instanceof Promise).toBe(
        true
      );
    });
  });

  describe('loadItemOnSyncStorage:', () => {
    it('throw a error when arg is not typeof string or object', done => {
      try {
        loadItemOnSyncStorage(true);
      } catch (e) {
        done();
      }
    });

    it('return a promise when is fed string', () => {
      expect(loadItemOnSyncStorage('key') instanceof Promise).toBe(true);
    });

    it('return a Promise when is fed object', () => {
      expect(loadItemOnSyncStorage({ key: 'value' }) instanceof Promise).toBe(
        true
      );
    });
  });

  describe('loadAllItemsOnSyncStorage', () => {
    it('return a promise when is called', () => {
      expect(loadAllItemsOnSyncStorage() instanceof Promise).toBe(true);
    });
  });

  describe('removeItemOnSyncStorage', () => {
    it('throw error when the arg is typeof object', done => {
      try {
        removeItemOnSyncStorage({ name: 'pile-book' });
      } catch (e) {
        done();
      }
    });

    it('return a promise when the arg is typeof string', () => {
      expect(removeItemOnSyncStorage('pile-book') instanceof Promise).toBe(
        true
      );
    });
  });

  describe('removeAllItemsOnSyncStorage', () => {
    it('return a promise when is called', () => {
      expect(removeAllItemsOnSyncStorage() instanceof Promise).toBe(true);
    });
  });

  describe('addOnChangeListenerInStorage', () => {
    it('no happen when is called', done => {
      try {
        addOnChangeListenerInStorage(() => 'listener');
        done();
      } catch (e) {
        fail();
      }
    });
  });
});
