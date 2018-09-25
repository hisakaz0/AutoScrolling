
import { getOptionItemWith } from './index';

describe("spec OptionItem:", () => {

  describe("which has boolean value: ", () => {

    beforeEach(() => {
      this.optionItem = getOptionItemWith('boolean');
      document.body.innerHTML = __html__['options.html'];
    })

    it("throw a error when string is fed into assertValue", done => {
      try {
        this.optionItem.assertValue('stststring');
      } catch (e) {
        done();
      }
    });

    it("nothing when boolean is fed into assertValue", done => {
      try {
        this.optionItem.assertValue(false);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it("ele.checked expected the value when setValueOnElement is called with a value", () =>{
      this.optionItem.value = ! this.optionItem.value;
      this.optionItem.setValueOnElement()
      expect(this.optionItem.value)
        .toBe(this.optionItem.getElement().checked);
    });

    it("return string 'change' when _getListenerType is called", () => {
      expect(this.optionItem._getListenerType()).toBe('change');
    });

    it("return boolean value when _getTargetValue is called", () => {
      const target = { checked: true, value: 'yes party party' };
      expect(this.optionItem._getTargetValue(target)).toBe(target.checked);
    });
  });
});
