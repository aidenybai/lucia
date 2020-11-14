import compute from '../helpers/compute';

export const htmlDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: Record<string, any>
) => {
  const out = compute(value, view);

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
