import SpeedParser from "../../../../src/modules/scrolling/speed-parser";

describe("parseSpeed:", () => {
  beforeEach(() => {
    this.speedParser = new SpeedParser();
  });

  it("return minimum parsed speed when num less than 0 is fed.", () => {
    const { interval, step } = this.speedParser.parse(-1);
    expect(interval).toBe(1000);
    expect(step).toBe(1);
  });

  it("return max parsed speed when num greater than 5000 is fed.", () => {
    const { interval, step } = this.speedParser.parse(6000);
    expect(interval).toBe(1);
    expect(step).toBe(5);
  });

  it("return { interval: 1, step: 1} when 1000 is fed.", () => {
    const { interval, step } = this.speedParser.parse(1000);
    expect(interval).toBe(1);
    expect(step).toBe(1);
  });

  it("return { interval: 10, step: 1} when 100 is fed.", () => {
    const { interval, step } = this.speedParser.parse(100);
    expect(interval).toBe(10);
    expect(step).toBe(1);
  });

  it("return { interval: 1, step: 2} when 2002, is fed.", () => {
    const { interval, step } = this.speedParser.parse(2002);
    expect(interval).toBe(1);
    expect(step).toBe(2);
  });

  it("return { interval: 5: step: 1} when 201 is fed.", () => {
    const { interval, step } = this.speedParser.parse(201);
    expect(interval).toBe(5);
    expect(step).toBe(1);
  });
});
