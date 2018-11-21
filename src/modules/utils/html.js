const CLASS_NAME_OF_HIDE = 'd-hide';

const showHtml = id => document.getElementById(id).classList.remove(CLASS_NAME_OF_HIDE);

const hideHtml = id => document.getElementById(id).classList.add(CLASS_NAME_OF_HIDE);

const appendHtmlText = (parent, htmlText) => {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(htmlText, 'text/html');
  [...parsedHtml.body.children].forEach(node => parent.appendChild(node));
};

export {
  showHtml, hideHtml, appendHtmlText, CLASS_NAME_OF_HIDE,
};
