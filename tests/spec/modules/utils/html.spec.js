import {
  showHtml,
  hideHtml,
  appendHtmlText,
  CLASS_NAME_OF_HIDE
} from '../../../../src/modules/utils/html';

describe('html module:', () => {
  beforeEach(() => {
    document.body.innerHTML = __html__['modal.html'];
  });

  describe('showHtml:', () => {
    it('do not have a class when is called with ele id', () => {
      const ele = document.getElementById('modal-id');
      showHtml(ele.id);
      expect(ele.classList.contains(CLASS_NAME_OF_HIDE)).toBe(false);
    });
  });

  describe('hideHtml:', () => {
    it('ele has a class when is called with ele id', () => {
      const ele = document.getElementById('modal-id');
      hideHtml(ele.id);
      expect(ele.classList.contains(CLASS_NAME_OF_HIDE)).toBe(true);
    });
  });

  describe('appendHtmlText', () => {
    it('ele has children when is called', () => {
      const htmlText = '<p>Hello</p>';
      const ele = document.getElementById('modal-id');
      appendHtmlText(ele, htmlText);
      expect(ele.children.length).toBe(1);
    });
  });
});
