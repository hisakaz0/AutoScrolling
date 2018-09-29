import { getOptionItemWith } from "./index";

describe("OptionItem:", () => {
  describe("which has a boolean typed value: ", () => {
    beforeEach(() => {
      this.optionItem = getOptionItemWith("boolean");
      document.body.innerHTML = __html__["options.html"];
    });

    it("throw a error when string is fed into assertValue", done => {
      try {
        this.optionItem.assertValue("stststring");
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

    it("return a reversed value when setValueOnElement is called with the value", () => {
      this.optionItem.value = !this.optionItem.value;
      this.optionItem.setValueOnElement();
      expect(this.optionItem.value).toBe(this.optionItem.getElement().checked);
    });

    it("return string 'change' when _getListenerType is called", () => {
      expect(this.optionItem._getListenerType()).toBe("change");
    });

    it("return 'true' when _getTargetValue is called with a object \
      which include checked property has true", () => {
      const target = { checked: true, value: "yes party party" };
      expect(this.optionItem._getTargetValue(target)).toBe(target.checked);
    });
  });
});
