import compute from '../helpers/compute';

export const htmlDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: ProxyConstructor | any
) => {
  const out = compute(value, view);

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
