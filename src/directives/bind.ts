import compute from '../utils/compute';

export const bindDirective = (
  el: HTMLElement | any,
  name: string,
  value: string | any,
  data: ProxyConstructor | any
) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classData = compute(value, data);
      if (typeof classData === 'string') {
        el.setAttribute('class', `${el.className} ${classData}`);
      }
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
      const bindData = compute(value, data);
      if (bindData) {
        el.setAttribute(name.split(':')[1], bindData);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
