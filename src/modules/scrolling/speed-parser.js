import appConst from '../../appConst.json';

const THOUSAND_MILLISECONDS = 1000;
const THRESHOLD_STEP = appConst.scrolling.thresholdStep; // for smooth scrolling

const isMaximunSpeed = speed => speed >= THOUSAND_MILLISECONDS * THRESHOLD_STEP;

const isMinimunSpeed = speed => speed <= 0;
const MINIMUN_PARSED_SPEED = { interval: THOUSAND_MILLISECONDS, step: 1 };
const MAXIMUM_PARSED_SPEED = { interval: 1, step: THRESHOLD_STEP };

const gcd = (n, m) => {
  let r = 0;
  while (n !== 0) {
    r = m % n;
    m = n; // eslint-disable-line no-param-reassign
    n = r; // eslint-disable-line no-param-reassign
  }
  return m;
};

const parseSpeed = (speed) => {
  if (isMinimunSpeed(speed)) return MINIMUN_PARSED_SPEED;
  if (isMaximunSpeed(speed)) return MAXIMUM_PARSED_SPEED;
  let interval = THOUSAND_MILLISECONDS;
  let step = speed;
  const retGcd = gcd(interval, speed);
  interval /= retGcd;
  step /= retGcd;
  if (step < THRESHOLD_STEP) return { interval, step };
  return parseSpeed(speed - 1);
};

export default parseSpeed;
