import compute from '../helpers/compute';

export const textDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view:  Record<string, any>
) => {
  const out = compute(value, view);

  el.textContent = out ?? value; 
};
