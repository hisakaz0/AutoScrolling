import { getOptionHtmlWith } from "./index";

describe("OptionHtml:", () => {
  describe("which has a value property typeof boolean:", () => {
    beforeEach(() => {
      this.optionHtml = getOptionHtmlWith("boolean");
      document.body.innerHTML = __html__["options.html"];
    });

    it("return 'true' when _getTargetValue is called with a object \
      which include checked property has true", () => {
      const target = { checked: true, value: "yes party party" };
      expect(this.optionHtml._getTargetValue(target)).toBe(target.checked);
    });

    it("return string 'change' when _getListenerType is called", () => {
      expect(this.optionHtml._getListenerType()).toBe("change");
    });

    it("return a reversed value when setValueOnElement is called with the value", () => {
      this.optionHtml.value = !this.optionHtml.defaultValue;
      this.optionHtml.setValueOnElement();
      expect(this.optionHtml.value).toBe(this.optionHtml.getElement().checked);
    });
  });
});
