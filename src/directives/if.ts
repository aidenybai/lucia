import compute from '../helpers/compute';

export const ifDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: Record<string, any>
) => {
  el.hidden = !compute(value, view);
};
