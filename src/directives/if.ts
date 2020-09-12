import compute from '../utils/compute';

export const ifDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: Function | any
) => {
  el.hidden = compute(value, data) ? false : true;
};