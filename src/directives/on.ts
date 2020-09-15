import compute from '../utils/compute';

export const directiveToEventHandler = (attr: string) => {
  return `on${attr.split(':')[1]}`;
}

export const onDirective = (
  el: HTMLElement | any,
  attr: string,
  value: string | any,
  data: ProxyConstructor | any
) => {
  el[directiveToEventHandler(attr)] = () => compute(value, data, false);
};
