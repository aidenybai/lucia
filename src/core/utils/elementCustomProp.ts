// Primarily used to set props that don't exist on normal HTML elements to be accessed later

export const getElementCustomProp = (el: HTMLElement, prop: string) => {
  return el[prop];
};

export const setElementCustomProp = (el: HTMLElement, prop: string, value: any) => {
  el[prop] = value;
};
