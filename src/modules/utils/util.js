const isSystemProtocol = url => {
  return url.match(/^about:/) !== null;
};

const isFunction = func => {
  return typeof func === typeof function() {};
};

const INVALID_TIMER_ID = -1;
const isValidTimerId = id => {
  return id !== INVALID_TIMER_ID;
};

export { isSystemProtocol, isFunction, isValidTimerId, INVALID_TIMER_ID };
