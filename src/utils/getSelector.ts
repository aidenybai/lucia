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
  let nth = 0;
  while (el.previousElementSibling !== null) {
    if (el.nodeName === element.nodeName) {
      nth++;
    }
    el = el.previousElementSibling;
  }

  return nth;
};

const nthSelectorNeeded = (selector: string, path: string): boolean => {
  const querySelector = path === '' ? selector : `${path} > ${selector}`;

  return document.querySelectorAll(querySelector).length > 1;
};

const buildPathString = (parents: Record<any, string>[]): string => {
  const pathArr: any[] = [];

  parents.forEach((parent: any) => {
    if (nthSelectorNeeded(parent.selector, pathArr.join(' > '))) {
      parent.selector += `:nth-of-type(${nthElement(parent.element)})`;
    }
    pathArr.push(parent.selector);
  });

  return pathArr.join(' > ');
};

const getSelector = (element: HTMLElement) => {
  return buildPathString(parentElements(element));
};

export default getSelector;
