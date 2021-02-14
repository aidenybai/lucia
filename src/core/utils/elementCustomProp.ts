// Primarily used to set props that don't exist on normal HTML elements to be accessed later

// @ts-ignore
export const getElementCustomProp = (el: HTMLElement, prop: string) => el[prop];

// @ts-ignore
export const setElementCustomProp = (el: HTMLElement, prop: string, value: any) => (el[prop] = value);
