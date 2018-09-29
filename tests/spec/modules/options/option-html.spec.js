import { getOptionHtmlWith } from "./index";

describe("OptionHtml:", () => {
  beforeEach(() => {
    this.optionHtml = getOptionHtmlWith("boolean");
    document.body.innerHTML = __html__["options.html"];
  });

  it("return object has id when constructor is called", () => {
    expect(this.optionHtml.id).not.toBe(undefined);
  });

  it("return a element when getElement is called", () => {
    const ele = this.optionHtml.getElement();
    expect(ele.attributes.toString()).toBe("[object NamedNodeMap]");
  });

  it("set the value of object, element when handleOnLoadStorage is called", () => {
    this.optionHtml.handleOnChangeStorage(false);
    expect(this.optionHtml.value).toBe(false);
    expect(this.optionHtml.getElement().checked).toBe(false);
  });

  it("set the value of object, element when handleOnLoadStorage is called", () => {
    this.optionHtml.handleOnLoadStorage(false);
    expect(this.optionHtml.value).toBe(false);
    expect(this.optionHtml.getElement().checked).toBe(false);
  });
});
