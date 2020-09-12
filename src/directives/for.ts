import compute from '../utils/compute';

export const forDirective = (el: HTMLElement | any, value: string | any, data: ProxyConstructor | any) => {
  const parts = value.split('by ');
  if (compute(parts[0], data) !== undefined) {
    el.innerHTML = compute(parts[0], data).join(parts[1] || '<br>');
  } else {
    el.innerHTML = parts[0].join(parts[1] || '<br>');
  }
};
