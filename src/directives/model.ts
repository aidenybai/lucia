export const modelDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: Function | any
) => {
  el.oninput = () => {
    data[value] = el.value;
  };
};
