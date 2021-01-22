import { DirectiveProps } from '../../models/structs';

export const bindDirective = ({ el, name, data, state }: DirectiveProps) => {
  switch (name.split(':')[1]) {
    case 'class':
      const hydratedClasses = data.compute(state);
      // Accept just providing classes regularly
      if (typeof hydratedClasses === 'string') {
        return el.setAttribute('class', `${el.className} ${hydratedClasses}`.trim());
        // Accept providing an array of classes and appending them
      } else if (hydratedClasses instanceof Array) {
        return el.setAttribute('class', `${el.className} ${hydratedClasses.join(' ')}`.trim());
      } else {
        // Accept binding classes on/off based off of boolean state value
        const classes = [];

        for (const key in hydratedClasses) {
          if (hydratedClasses[key] && !el.className.includes(key)) classes.push(key);
        }

        const removeDynamicClassesRE = new RegExp(Object.keys(hydratedClasses).join('|'), 'gim');
        const rawClasses = el.className.replace(removeDynamicClassesRE, '');

        if (classes.length > 0) {
          return el.setAttribute('class', `${rawClasses} ${classes.join(' ')}`.trim());
        } else if (el.className.trim().length > 0) {
          return el.setAttribute('class', rawClasses.trim());
        } else {
          return el.removeAttribute('class');
        }
      }
    case 'style':
      // Accept object and set properties based on boolean state value
      const hydratedStyles = data.compute(state);
      el.removeAttribute('style');
      for (const key in hydratedStyles) {
        el.style[key] = hydratedStyles[key];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean state value
      const hydratedAttributes = data.compute(state);
      // Allow object syntax in binding without modifier
      if (typeof hydratedAttributes === 'object' && hydratedAttributes !== null) {
        for (const key in hydratedAttributes) {
          // Only set attr if not falsy
          if (hydratedAttributes[key]) {
            el.setAttribute(key, hydratedAttributes[key]);
          } else {
            el.removeAttribute(key);
          }
        }
        // Only set attr if not falsy
      } else if (hydratedAttributes) {
        el.setAttribute(name.split(':')[1], hydratedAttributes);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
