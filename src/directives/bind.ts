import compute from '../utils/compute';

export const bindDirective = (
  el: HTMLElement | any,
  attr: string,
  value: string | any,
  data: Function | any
) => {
  switch (attr.split(':')[1]) {
    case 'class':
      const classData = compute(value, data);
      if (classData instanceof Array) {
        el.setAttribute('class', classData.join(' '));
      } else {
        const classes = [];
        for (const key in classData) {
          if (classData[key]) classes.push(key);
        }
        if (classes.length > 0) {
          el.setAttribute('class', classes.join(' '));
        } else {
          el.removeAttribute('class');
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
      el.setAttribute(attr.split(':')[1], compute(value, data));
      break;
  }
};
