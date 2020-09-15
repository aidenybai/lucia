import compute from '../utils/compute';

export const htmlDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: ProxyConstructor | any
) => {
  const out = compute(value, data);
  
  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
