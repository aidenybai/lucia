import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const bindDirective = ({ el, name, value, state }: DirectiveProps) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classState = compute(value, { $state: state, $el: el });
      // Accept just providing classes regularly
      if (typeof classState === 'string') {
        return el.setAttribute('class', `${el.className} ${classState}`.trim());
      }
      // Accept providing an array of classes and appending them
      if (classState instanceof Array) {
        return el.setAttribute('class', `${el.className} ${classState.join(' ')}`.trim());
      } else {
        // Accept binding classes on/off based off of boolean state value
        const classes = [];
        for (const key in classState) {
          if (classState[key]) classes.push(key);
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
      // Accept object and set properties based on boolean state value
      const styleState = compute(value, { $state: state, $el: el });
      el.removeAttribute('style');
      for (const key in styleState) {
        el.style[key] = styleState[key];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean state value
      const out = compute(value, { $state: state, $el: el });
      if (out) {
        el.setAttribute(name.split(':')[1], out);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
