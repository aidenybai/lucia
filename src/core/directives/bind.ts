import { DirectiveProps } from '../../models/structs';

export const formatAcceptableWhitespace = (expression: string) => {
  return expression.replace(/\s+/gim, ' ').trim();
};

export const bindDirective = ({ el, parts, data, state }: DirectiveProps) => {
  switch (parts[1]) {
    case 'class':
      const classes = data.compute(state);
      // Accept just providing classes regularly
      if (typeof classes === 'string') {
        return el.setAttribute('class', formatAcceptableWhitespace(`${el.className} ${classes}`));
        // Accept providing an array of classes and appending them
      } else if (classes instanceof Array) {
        return el.setAttribute(
          'class',
          formatAcceptableWhitespace(`${el.className} ${classes.join(' ')}`)
        );
      } else {
        // Accept binding classes on/off based off of boolean state value
        const activeClasses = [];

        for (const prop in classes) {
          if (classes[prop]) activeClasses.push(prop);
        }

        const removeDynamicClassesRE = new RegExp(`\\b${Object.keys(classes).join('|')}\\b`, 'gim');
        const rawClasses = el.className.replace(removeDynamicClassesRE, '');

        if (activeClasses.length > 0) {
          return el.setAttribute(
            'class',
            formatAcceptableWhitespace(`${rawClasses} ${activeClasses.join(' ')}`)
          );
        } else if (formatAcceptableWhitespace(rawClasses).length > 0) {
          return el.setAttribute('class', formatAcceptableWhitespace(rawClasses));
        } else if (el.hasAttribute('class')) {
          /* istanbul ignore next */
          return el.removeAttribute('class');
        }
      }
      break;
    case 'style':
      // Accept object and set properties based on boolean state value
      const styles = data.compute(state);
      el.removeAttribute('style');
      for (const prop in styles) {
        el.style[prop] = styles[prop];
      }
      break;
    default:
      // Bind arbitrary attributes based on boolean state value
      const attributes = data.compute(state);

      // Allow object syntax in binding without modifier
      if (typeof attributes === 'object' && attributes !== null) {
        for (const prop in attributes) {
          // Only set attr if not falsy
          if (attributes[prop]) {
            el.setAttribute(prop, attributes[prop]);
          } else {
            el.removeAttribute(prop);
          }
        }
        // Only set attr if not falsy
      } else if (attributes) {
        el.setAttribute(parts[1], attributes);
      } else {
        el.removeAttribute(parts[1]);
      }
      break;
  }
};
