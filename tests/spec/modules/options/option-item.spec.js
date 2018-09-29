import { getOptionItemWith } from "./index";

describe("OptionItem:", () => {
  beforeEach(() => {
    this.optionItem = getOptionItemWith("boolean");
    document.body.innerHTML = __html__["options.html"];
  });

  it("return object has name and id when getOptionItemWith is called", () => {
    expect(typeof this.optionItem.name).toBe("string");
    expect(typeof this.optionItem.id).toBe("string");
    expect(typeof this.optionItem.defaultValue).toBe("boolean");
  });

  it("return promise when _saveOptionValue is called", done => {
    const newData = {};
    newData[this.optionItem.name] = false;
    this.optionItem._setOptionValue(newData).then(savedData => {
      expect(savedData).toBe(false);
      expect(this.optionItem.value).toBe(false);
      done();
    });
  });

  it("return a element when getElement is called", () => {
    const ele = this.optionItem.getElement();
    expect(ele.attributes.toString()).toBe("[object NamedNodeMap]");
  });

  it("return false when hasCommand is called", () => {
    expect(this.optionItem.hasCommand()).toBe(false);
  });
});
