import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';

export const bindDirective = ({ el, name, value, view }: DirectiveProps) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classView = compute(value, { $view: view, $el: el });
      // Accept just providing classes regularly
      if (typeof classView === 'string') {
        return el.setAttribute('class', `${el.className} ${classView}`.trim());
      }
      // Accept providing an array of classes and appending them
      if (classView instanceof Array) {
        return el.setAttribute('class', `${el.className} ${classView.join(' ')}`.trim());
      } else {
        // Accept binding classes on/off based off of boolean view value
        const classes = [];
        for (const key in classView) {
          if (classView[key]) classes.push(key);
        }
        if (classes.length > 0) {
          return el.setAttribute('class', `${el.className} ${classes.join(' ').trim()}`.trim());
        } else if (el.className.trim().length > 0) {
          return el.setAttribute('class', el.className);
        } else {
          return el.removeAttribute('class');
        }
      }
    case 'style':
      // Accept object and set properties based on boolean view value
      const styleView = compute(value, { $view: view, $el: el });
      el.removeAttribute('style');
      for (const key in styleView) {
        el.style[key] = styleView[key];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean view value
      const out = compute(value, { $view: view, $el: el });
      if (out) {
        el.setAttribute(name.split(':')[1], out);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
