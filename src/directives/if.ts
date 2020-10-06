import compute from '../utils/compute';

export const ifDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: ProxyConstructor | any
) => {
  el.hidden = !compute(value, data);
};
