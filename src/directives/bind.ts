import compute from '../helpers/compute';
import { directiveArgs } from '../helpers/interfaces';

export const bindDirective = ({ el, name, value, view }: directiveArgs) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classView = compute(value, view);
      if (typeof classView === 'string') {
        return el.setAttribute('class', `${el.className} ${classView}`.trim());
      }
      if (classView instanceof Array) {
        return el.setAttribute('class', `${el.className} ${classView.join(' ').trim()}`);
      } else {
        const classes = [];
        for (const key in classView) {
          if (classView[key]) classes.push(key);
        }
        if (classes.length > 0) {
          return el.setAttribute('class', `${el.className} ${classes.join(' ').trim()}`.trim());
        } else if (el.className.length.trim() > 0) {
          return el.setAttribute('class', el.className);
        } else {
          return el.removeAttribute('class');
        }
      }
    case 'style':
      const styleView = compute(value, view);
      el.removeAttribute('style');
      for (const key in styleView) {
        el.style[key] = styleView[key];
      }
      break;
    default:
      const out = compute(value, view);
      if (out) {
        el.setAttribute(name.split(':')[1], out);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
