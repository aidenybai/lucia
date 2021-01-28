// Primarily used to set props that don't exist on normal HTML elements to be accessed later

// @ts-ignore
export const getCustomProp = (el: HTMLElement, prop: string) => el[prop];

// @ts-ignore
export const setCustomProp = (el: HTMLElement, prop: string, value: any) => (el[prop] = value);
