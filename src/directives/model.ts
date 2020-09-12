export const modelDirective = (
  el: HTMLElement | any,
  value: string | any,
  data: ProxyConstructor | any
) => {
  el.oninput = () => {
    data[value] = el.value;
  };
};
