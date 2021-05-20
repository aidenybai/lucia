import { DirectiveProps } from '@models/structs';

export const formatAcceptableWhitespace = (expression: string): string => {
  const whitespaceRE = /\s+/gim;
  return expression.replace(whitespaceRE, ' ').trim();
};

export const bindDirective = ({ el, parts, data, state }: DirectiveProps): void => {
  switch (parts[1]) {
    case 'class': {
      const classes = data.compute(state);
      const removeDynamicClassesRE = new RegExp(`\\b${Object.keys(classes).join('|')}\\b`, 'gim');
      const rawClasses = el.className.replace(removeDynamicClassesRE, '');
      // Accept just providing classes regularly
      if (typeof classes === 'string') {
        el.className = formatAcceptableWhitespace(`${rawClasses} ${classes}`);
        // Accept providing an array of classes and appending them
      } else if (Array.isArray(classes)) {
        el.className = formatAcceptableWhitespace(`${rawClasses} ${classes.join(' ')}`);
      } else {
        // Accept binding classes on/off based off of boolean state value
        const activeClasses: string[] = [];

        Object.entries(classes).forEach(([className, classValue]) => {
          if (classValue) activeClasses.push(className);
        });

        if (activeClasses.length > 0) {
          el.className = formatAcceptableWhitespace(`${rawClasses} ${activeClasses.join(' ')}`);
        } else if (formatAcceptableWhitespace(rawClasses).length > 0) {
          el.className = formatAcceptableWhitespace(rawClasses);
        } else {
          el.className = '';
          el.removeAttribute('class');
        }
      }
      break;
    }

    case 'style': {
      // Accept object and set properties based on boolean state value
      const styles = data.compute(state);
      if (el.hasAttribute('style')) el.removeAttribute('style');
      Object.entries(styles).forEach(([styleName, styleValue]) => {
        el.style[styleName] = styleValue;
      });
      break;
    }
    default: {
      // Bind arbitrary attributes based on boolean state value
      const attributes = data.compute(state);

      // Allow object syntax in binding without modifier
      if (typeof attributes === 'object' && attributes !== null) {
        Object.entries(attributes).forEach(([name, value]) => {
          // Only set attr if not falsy
          if (value) {
            el.setAttribute(name, value as string);
          } else {
            el.removeAttribute(name);
          }
        });
      } else if (attributes) {
        el.setAttribute(parts[1], attributes);
      } else {
        if (el.hasAttribute(parts[1])) el.removeAttribute(parts[1]);
      }
      break;
    }
  }
};
