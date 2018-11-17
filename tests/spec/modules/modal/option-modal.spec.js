import OptionModal from '../../../../src/modules/modal/option-modal';

describe('option-modal module:', () => {
  describe('OptionModal:', () => {
    beforeEach(function() {
      this.modal = new OptionModal();
    });

    describe('loadHtml:', () => {
      it('html is set when is called', function() {
        this.modal.loadHtml();
        expect(this.modal.html instanceof HTMLElement).toBe(true);
      });
    });

    describe('appendHtmlToBody:', () => {
      it('dom is appended into body when is called', function() {
        this.modal.loadHtml();
        const ret = this.modal.appendHtmlToBody();
        expect(ret).toEqual(this.modal.html);
      });
    });

    describe('open:', () => {
      it('display the modal window when is called', function() {
        this.modal.loadHtml();
        const modal = this.modal.appendHtmlToBody();
        this.modal.open();
        expect(modal.classList.contains('active')).toBe(true);
      });
    });

    describe('close:', () => {
      it('hide the modal window when is called', function() {
        this.modal.loadHtml();
        const modal = this.modal.appendHtmlToBody();
        this.modal.open();
        this.modal.close();
        expect(modal.classList.contains('active')).toBe(false);
      });
    });

    describe('setOnCloseListener:', () => {
      it('set listener when is called', function() {
        this.modal.setOnCloseListener(() => 'l');
        expect(this.modal.onCloseListener instanceof Function).toBe(true);
      });
    });

    describe('set/onCloseButtonClickListener:', () => {
      beforeEach(function() {
        spyOn(this.modal, 'close');
        spyOn(this.modal, 'onCloseListener');
      });

      it('close() and onCloseListener() is called when event is dispatched', function() {
        this.modal.loadHtml();
        this.modal.appendHtmlToBody();
        this.modal.open();
        this.modal.setOnCloseListener(() => 'l');
        this.setOnCloseButtonClickListener();
        const ele = this.getCloseEles()[0];
        ele.dispachEvent();

        expect(this.modal.onCloseListener).toHaveBeenCalled();
        expect(this.modal.close).toHaveBeenCalled();
      });
    });
  });
});
