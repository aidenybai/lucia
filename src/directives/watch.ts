import compute from '../helpers/compute';

export const watchDirective = (
  _el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: ProxyConstructor | any
) => {
  compute(value, view);
};
