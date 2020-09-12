import compute from '../utils/compute';

export const htmlDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: Function | any
) => {
  console.log(data);
  if (compute(value, data) !== undefined) {
    el.innerHTML = compute(value, data);
  } else {
    el.innerHTML = value;
  }
};
