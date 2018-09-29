import { getOptionItemWith } from ".";

describe("OptionItem:", () => {
  describe("has command:", () => {
    beforeEach(() => {
      this.optionItem = getOptionItemWith("string");
    });

    it("return true when hasCommand is called", () => {
      expect(this.optionItem.hasCommand()).toBe(true);
    });
  });
});
