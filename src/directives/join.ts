import compute from '../helpers/compute';

export const joinDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: ProxyConstructor | any
) => {
  const parts = value.split('by ');
  const out = compute(parts[0], view);

  if (out !== undefined) {
    el.innerHTML = out.join(parts[1] || '');
  } else {
    el.innerHTML = parts[0].join(parts[1] || '');
  }
};
