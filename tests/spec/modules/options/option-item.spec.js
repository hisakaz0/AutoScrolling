
import { OptionItem } from '../../../../src/modules/options';
import appConst from '../../../../src/appConst.json';

describe("spec OptionItem:", () => {

  it("can new instance", () => {
    const optionItem = new OptionItem();
  });

  describe("which has boolean value: ", () => {

    beforeEach(() => {
      this.opts = appConst.options;
      Object.keys(this.opts).forEach(key => {
        if (typeof this.opts[key].value !== 'boolean' ||
            typeof this.optionItem !== 'undefined') return;
        this.optionItem = new OptionItem(
          key, this.opts[key].id, this.opts[key].value
        );
      });
      document.body.innerHTML = __html__['options.html'];
    });

    it("return promise when _saveOptionValue is called", done => {
      const newData = {};
      newData[this.optionItem.name] = false;
      this.optionItem._setOptionValue(newData)
        .then(savedData => {
          expect(savedData).toBe(false);
          expect(this.optionItem.value).toBe(false);
          done();
        });
    });

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

    it("return false when hasCommand is called", () => {
      expect(this.optionItem.hasCommand()).toBe(false);
    });

    it("return a element when getElement is called", () => {
      const ele = this.optionItem.getElement();
      expect(ele.attributes.toString()).toBe("[object NamedNodeMap]");
    });

    it("set reversed of this.value when call setValueOnElement with the value", () =>{
      this.optionItem.value = ! this.optionItem.value;
      this.optionItem.setValueOnElement()
      expect(this.optionItem.value)
        .toBe( this.optionItem.getElement().checked);
    });

    it("return string 'change' when _getListenerType is called", () => {
      expect(this.optionItem._getListenerType()).toBe('change');
    });

    it("return boolean value when _getTargetValue is called", () => {
      const target = { checked: true, value: 'yes party party' };
      expect(this.optionItem._getTargetValue(target)).toBe(true);
    });
  });
});