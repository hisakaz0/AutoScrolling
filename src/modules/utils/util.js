const isSystemProtocol = url => {
  return url.match(/^about:/) !== null;
};

export { isSystemProtocol };
