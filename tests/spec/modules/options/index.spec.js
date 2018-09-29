import { getOptionItemWith, getOptionHtmlWith } from "./index";
import { OptionItem, OptionHtml } from "../../../../src/modules/options";

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
      expect(typeof getOptionItemWith()).toBe(typeof undefined);
    });
  });
});

describe("getOptionHtmlWith:", () => {
  it("return a instanceof OptionHtml when called with 'boolean'", () => {
    expect(getOptionHtmlWith("boolean") instanceof OptionHtml).toBe(true);
  });

  describe("return a object which include defaultValue property:", () => {
    it("which is boolean type if called with 'boolean'", () => {
      expect(typeof getOptionHtmlWith("boolean").defaultValue).toBe(
        typeof true
      );
    });

    it("which is string tupe if called with 'string'", () => {
      expect(typeof getOptionHtmlWith("string").defaultValue).toBe(typeof "");
    });

    it("which is number type if called with 'number'", () => {
      expect(typeof getOptionHtmlWith("number").defaultValue).toBe(typeof 0);
    });

    it("which retur undefined if called with no args", () => {
      expect(typeof getOptionHtmlWith()).toBe(typeof undefined);
    });
  });
});
