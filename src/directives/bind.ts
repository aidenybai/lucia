import compute from '../helpers/compute';

export const bindDirective = (
  el: HTMLElement | any,
  name: string,
  value: string | any,
  view: ProxyConstructor | any
) => {
  switch (name.split(':')[1]) {
    case 'class':
      const classview = compute(value, view, true);
      if (typeof classview === 'string') {
        return el.setAttribute('class', `${el.className} ${classview}`.trim());
      }
      if (classview instanceof Array) {
        return el.setAttribute('class', `${el.className} ${classview.join(' ').trim()}`);
      } else {
        const classes = [];
        for (const key in classview) {
          if (classview[key]) classes.push(key);
        }
        if (classes.length > 0) {
          return el.setAttribute('class', `${el.className} ${classview.join(' ').trim()}`);
        } else if (el.className.length.trim() > 0) {
          return el.setAttribute('class', el.className);
        } else {
          return el.removeAttribute('class');
        }
      }
    case 'style':
      const styleview = compute(value, view);
      el.removeAttribute('style');
      for (const key in styleview) {
        el.style[key] = styleview[key];
      }
      break;
    default:
      const bindview = compute(value, view);
      if (bindview) {
        el.setAttribute(name.split(':')[1], bindview);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }
      break;
  }
};
