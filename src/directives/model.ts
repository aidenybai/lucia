export const modelDirective = (
  el: HTMLElement | any,
  value: string | any,
  view: ProxyConstructor | any
) => {
  el.value = view[value];
  el.oninput = () => {
    view[value] = el.value;
  };
};
