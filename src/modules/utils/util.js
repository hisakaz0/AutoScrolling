const isSystemProtocol = url => {
  return url.match(/^about:/) !== null;
};

const isFunction = func => {
  return typeof func === typeof function() {};
};

const appendHtmlText = (parent, htmlText) => {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(htmlText, 'text/html');
  for (const node of parsedHtml.body.children) {
    parent.appendChild(node);
  }
};

export { isSystemProtocol, isFunction, appendHtmlText };
