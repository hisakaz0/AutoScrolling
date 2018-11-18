const CLASS_NAME_OF_HIDE = 'd-hide';

const showHtml = id => {
  return document.getElementById(id).classList.remove(CLASS_NAME_OF_HIDE);
};

const hideHtml = id => {
  return document.getElementById(id).classList.add(CLASS_NAME_OF_HIDE);
};

const appendHtmlText = (parent, htmlText) => {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(htmlText, 'text/html');
  for (const node of parsedHtml.body.children) {
    parent.appendChild(node);
  }
};

export { showHtml, hideHtml, appendHtmlText, CLASS_NAME_OF_HIDE };
