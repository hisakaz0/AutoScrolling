const isSystemProtocol = url => (
  url.match(/^about:/) !== null || url.match(/^chrome:/) !== null
);

const INVALID_TIMER_ID = -1;
const isValidTimerId = id => id !== INVALID_TIMER_ID;

export { isSystemProtocol, isValidTimerId, INVALID_TIMER_ID };
