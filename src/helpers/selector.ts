// Adapted from https://github.com/zypox/dom-element-path

const parentElements = (element: HTMLElement | any): Record<any, string>[] => {
  const parents = [];
  while (element) {
    const tagName = element.nodeName.toLowerCase();
    const cssId = element.id ? `#${element.id}` : '';
    const cssClass = element.className ? `.${element.className.replace(/\s+/g, '.')}` : '';

    parents.unshift({
      element,
      selector: tagName + cssId + cssClass,
    });

    element = element.parentNode !== document ? element.parentNode : false;
  }

  return parents;
};

const nthElement = (element: HTMLElement | any): number => {
  let el = element;
  let nth = 1;

  while (el.previousElementSibling !== null) {
    if (el.previousElementSibling.nodeName === element.nodeName) nth++;
    el = el.previousElementSibling;
  }

  return nth;
};

const nthSelectorNeeded = (selector: string, path: string): boolean => {
  const querySelector = path === '' ? selector : `${path} > ${selector}`;

  return document.querySelectorAll(querySelector).length > 1;
};

const buildPathString = (parents: Record<any, string>[]): string => {
  let pathArr: any[] = [];

  for (const parent of parents) {
    if (nthSelectorNeeded(parent.selector, pathArr.join(' > '))) {
      parent.selector += `:nth-of-type(${nthElement(parent.element)})`;
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

export const mapAttributes = (el: Record<string, any>): Record<string, any> => {
  const attributes: Record<string, any> = {};
  const directives: Record<string, any> = {};

  if (el.attributes || el.directives) {
    for (const { name, value } of el.attributes) {
      if (name.startsWith('*')) {
        directives[name.replace('*', '')] = value;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export const getSelector = (element: HTMLElement | any) => {
  return buildPathString(parentElements(element));
};
