import compute from '../utils/compute';

export const joinDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: ProxyConstructor | any
) => {
  const parts = value.split('by ');
  const out = compute(parts[0], data);

  if (out !== undefined) {
    el.innerHTML = out.join(parts[1] || '<br>');
  } else {
    el.innerHTML = parts[0].join(parts[1] || '<br>');
  }
};
