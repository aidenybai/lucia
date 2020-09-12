import compute from '../utils/compute';

export const onDirective = (
  el: HTMLElement | any,
  attr: string,
  value: string | any,
  data: Function | any
) => {
  const eventHandler = () => compute(value, data, false); // possible need this.data reference
  el[`on${attr.split(':')[1]}`] = eventHandler; 
};