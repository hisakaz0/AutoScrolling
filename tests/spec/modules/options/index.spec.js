import { getOptionItemWith } from "./index";
import { OptionItem } from "../../../../src//modules/options";

describe("getOptionItemWith:", () => {
  it("return a instanceof OptionItem when called with 'boolean'", () => {
    expect(getOptionItemWith("boolean") instanceof OptionItem).toBe(true);
  });

  describe("return a object which include defalutValue property:", () => {
    it("which is boolean type if called with 'boolean'", () => {
      expect(typeof getOptionItemWith("boolean").defaultValue).toBe(
        typeof true
      );
    });

    it("which is string type if called with 'string'", () => {
      expect(typeof getOptionItemWith("string").defaultValue).toBe(typeof "");
    });

    it("which is number type if call with 'number'", () => {
      expect(typeof getOptionItemWith("number").defaultValue).toBe(typeof 0);
    });

    it("which return undefined if called with no args", () => {
      expect(getOptionItemWith()).toBe(undefined);
    });
  });
});
