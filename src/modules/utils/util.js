const isSystemProtocol = url => {
  return url.match(/^about:/) !== null;
};

const isFunction = func => {
  return typeof func === typeof function() {};
};

export { isSystemProtocol, isFunction };
