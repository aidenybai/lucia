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

        for (const prop in hydratedClasses) {
          if (hydratedClasses[prop] && !el.className.includes(prop)) classes.push(prop);
        }

        const removeDynamicClassesRE = new RegExp(
          `\\b${Object.keys(hydratedClasses).join('|')}\\b`,
          'gim'
        );
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
      for (const prop in hydratedStyles) {
        el.style[prop] = hydratedStyles[prop];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean state value
      const hydratedAttributes = data.compute(state);
      // Allow object syntax in binding without modifier
      if (typeof hydratedAttributes === 'object' && hydratedAttributes !== null) {
        for (const prop in hydratedAttributes) {
          // Only set attr if not falsy
          if (hydratedAttributes[prop]) {
            el.setAttribute(prop, hydratedAttributes[prop]);
          } else {
            el.removeAttribute(prop);
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
