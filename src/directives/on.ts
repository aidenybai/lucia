import compute from '../utils/compute';

export const onDirective = (
  el: HTMLElement | any,
  attr: string,
  value: string | any,
  data: ProxyConstructor | any
) => {
  const eventHandler = () => compute(value, data, false);
  el[`on${attr.split(':')[1]}`] = eventHandler;
};
