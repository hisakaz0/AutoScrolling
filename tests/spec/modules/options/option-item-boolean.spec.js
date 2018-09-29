import { getOptionItemWith } from "./index";

describe("OptionItem:", () => {
  describe("which has a boolean typed value:", () => {
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
  });
});
