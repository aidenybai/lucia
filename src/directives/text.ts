import compute from '../helpers/compute';

export const textDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: ProxyConstructor | any
) => {
  const out = compute(value, view);

  if (out !== undefined) {
    el.textContent = out;
  } else { 
    el.textContent = value;
  }
};
