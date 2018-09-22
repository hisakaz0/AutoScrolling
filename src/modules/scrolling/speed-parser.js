import appConst from "../../appConst.json";

const THOUSAND_MILLISECONDS = 1000;
const THRESHOLD_STEP = appConst.scrolling.thresholdStep; // for smooth scrolling

const gcd = (n, m) => {
  let r = 0;
  while (n !== 0) {
    r = m % n;
    m = n;
    n = r;
  }
  return m;
};

const parseSpeed = speed => {
  let interval = THOUSAND_MILLISECONDS;
  let step = speed;
  const retGcd = gcd(interval, speed);
  interval = interval / retGcd;
  step = step / retGcd;
  if (step < THRESHOLD_STEP) return { interval, step };
  return parseSpeed(speed - 1);
};

export default parseSpeed;
