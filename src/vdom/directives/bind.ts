import { DirectiveProps } from '../../models/structs';

export const bindDirective = ({ el, name, data, app }: DirectiveProps) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classState = data.compute(app.state);
      // Accept just providing classes regularly
      if (typeof classState === 'string') {
        return el.setAttribute('class', `${el.className} ${classState}`.trim());
        // Accept providing an array of classes and appending them
      } else if (classState instanceof Array) {
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
      const styleState = data.compute(app.state);
      el.removeAttribute('style');
      for (const key in styleState) {
        el.style[key] = styleState[key];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean state value
      const out = data.compute(app.state);
      if (typeof out === 'object' && out !== null) {
        for (const key in out) {
          if (out[key]) {
            el.setAttribute(key, out[key]);
          } else {
            el.removeAttribute(key);
          }
        }
      } else if (out) {
        el.setAttribute(name.split(':')[1], out);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
