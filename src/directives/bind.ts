import compute from '../utils/compute';

export const bindDirective = (
  el: HTMLElement | any,
  name: string,
  value: string | any,
  data: ProxyConstructor | any
) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classData = compute(value, data, true);
      if (typeof classData === 'string') {
        return el.setAttribute('class', `${el.className} ${classData}`.trim());
      }
      if (classData instanceof Array) {
        return el.setAttribute('class', `${el.className} ${classData.join(' ').trim()}`);
      } else {
        const classes = [];
        for (const key in classData) {
          if (classData[key]) classes.push(key);
        }
        if (classes.length > 0) {
          return el.setAttribute('class', `${el.className} ${classData.join(' ').trim()}`);
        } else if (el.className.length.trim() > 0) {
          return el.setAttribute('class', el.className);
        } else {
          return el.removeAttribute('class');
        }
      }
      break;
    case 'style':
      const styleData = compute(value, data);
      el.removeAttribute('style');
      for (const key in styleData) {
        el.style[key] = styleData[key];
      }
      break;
    default:
      const bindData = compute(value, data);
      if (bindData) {
        el.setAttribute(name.split(':')[1], bindData);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
