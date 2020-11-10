// Adapted from https://github.com/zypox/dom-element-path

const parentElements = (el: Element | any): Record<any, Element | string | any>[] => {
  const parents = [];
  while (el) {
    const tagName = el.nodeName.toLowerCase();
    const cssId = el.id ? `#${el.id}` : '';
    let cssClass: string = '';
    if (el.className && typeof el.className === 'string') {
      cssClass = `.${el.className.replace(/\s+/g, '.').replace(/[:*+?^${}()|[\]\\]/gi, '\\$&')}`;
    }

    parents.unshift({
      el,
      selector: tagName + cssId + cssClass,
    });
    el = el.parentNode !== document ? el.parentNode : false;
  }

  return parents;
};

const nthElement = (el: Element | any): number => {
  let element = el;
  let nth = 1;

  while (element.previousElementSibling !== null) {
    if (element.previousElementSibling.nodeName === el.nodeName) nth++;
    element = element.previousElementSibling;
  }

  return nth;
};

const nthSelectorNeeded = (selector: string, path: string): boolean => {
  const querySelector = path === '' ? selector : `${path} > ${selector}`;

  return document.querySelectorAll(querySelector).length > 1;
};

const buildPathString = (parents: Record<any, string>[]): string => {
  let pathArr: string[] = [];

  for (const parent of parents) {
    if (nthSelectorNeeded(parent.selector, pathArr.join(' > '))) {
      parent.selector += `:nth-of-type(${nthElement(parent.el)})`;
    }
    pathArr.push(parent.selector);
  }

  for (const path of pathArr) {
    if (path.includes('#')) {
      pathArr = pathArr.slice(pathArr.indexOf(path));
    }
  }

  return pathArr.join(' > ');
};

export const getProps = (el: Record<string, any>): Record<string, any> => {
  const attributes: Record<string, any> = {};
  const directives: Record<string, any> = {};

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      if (name.startsWith('l-')) {
        directives[name.replace('l-', '')] = value;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export const getSelector = (el: HTMLElement | any) => {
  return buildPathString(parentElements(el));
};
