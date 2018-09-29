import appConst from "../../appConst.json";

const THOUSAND_MILLISECONDS = 1000;
const THRESHOLD_STEP = appConst.scrolling.thresholdStep; // for smooth scrolling

class SpeedParser {
  constructor() {
    this.MINIMUN_PARSED_SPEED = { interval: THOUSAND_MILLISECONDS, step: 1 };
    this.MAXIMUM_PARSED_SPEED = { interval: 1, step: THRESHOLD_STEP };
  }

  parse(speed) {
    if (this.isMinimunSpeed(speed)) return this.MINIMUN_PARSED_SPEED;
    if (this.isMaximunSpeed(speed)) return this.MAXIMUM_PARSED_SPEED;
    let interval = THOUSAND_MILLISECONDS;
    let step = speed;
    const retGcd = this._gcd(interval, speed);
    interval = interval / retGcd;
    step = step / retGcd;
    if (step < THRESHOLD_STEP) return { interval, step };
    return this.parse(speed - 1);
  }

  _gcd(n, m) {
    let r = 0;
    while (n !== 0) {
      r = m % n;
      m = n;
      n = r;
    }
    return m;
  }

  isMaximunSpeed(speed) {
    return speed >= THOUSAND_MILLISECONDS * THRESHOLD_STEP;
  }

  isMinimunSpeed(speed) {
    return speed <= 0;
  }
}

export default SpeedParser;
