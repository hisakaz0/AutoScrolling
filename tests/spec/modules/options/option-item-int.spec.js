
import { getOptionItemWith } from '.';

describe("spec OptionItem:", () => {

  describe("which has boolean value: ", () => {

    beforeEach(() => {
      this.optionItem = getOptionItemWith('number');
      document.body.innerHTML = __html__['options.html'];
    });

    it("ele.value is expected when setValueOnElement is called with a number value", () => {
      this.optionItem.value = 1000;
      this.optionItem.setValueOnElement();
      expect(this.optionItem.getElement().value)
        .toBe(this.optionItem.value.toString());
    });

    it("return number value when _getTargetValue is called", done => {
      const target1 = { value: "100" };
      expect(this.optionItem._getTargetValue(target1))
        .toBe(parseInt(target1.value));
      const target2 = { value: 10000 };
      expect(this.optionItem._getTargetValue(target2))
        .toBe(target2.value);
      const target3 = { value: 'stringValue' };
      try {
        this.optionItem._getTargetValue(target3);
        fail();
      } catch(e) {
        done();
      }
    });
  });
});