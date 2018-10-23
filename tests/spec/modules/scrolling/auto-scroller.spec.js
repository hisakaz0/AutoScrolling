import { AutoScroller, SpeedParser } from "../../../../src/modules/scrolling";

describe("AutoScroller:", () => {
  beforeEach(() => {
    document.body.innerHTML = __html__["scrolling.html"];
    this.scroller = new AutoScroller();
  });

  it("parser and options are set when init is called", () => {
    this.scroller.init();
    expect(this.scroller.parser instanceof SpeedParser).toBe(true);
  });
});
