import { getOptionItemWith } from "./index";

describe("OptionItem:", () => {
  describe("has string value:", () => {
    beforeEach(() => {
      this.optionItem = getOptionItemWith("string");
      document.body.innerHTML = __html__["options.html"];
    });

    it("throw a error when boolean is fed into assertValue", done => {
      try {
        this.optionItem.assertValue(true);
      } catch (e) {
        done();
      }
    });

    it("nothing when string is fed int assertValue", done => {
      try {
        this.optionItem.assertValue("nothing to do");
        done();
      } catch (e) {
        fail(e);
      }
    });

    it("ele.vlaue is expected value when setValueOnElement is called with a value", () => {
      this.optionItem.value = "expected string";
      this.optionItem.setValueOnElement();
      expect(this.optionItem.getElement().value).toBe(this.optionItem.value);
    });

    it("return 'blur' when _getListenerType is called", () => {
      expect(this.optionItem._getListenerType()).toBe("blur");
    });

    it("return string value when _getTargetValue is called", () => {
      const target = { checked: false, value: "magic power" };
      expect(this.optionItem._getTargetValue(target)).toBe(target.value);
    });
  });
});
