export const element = (
  el: string,
  tagName: string,
  attributes: any = {},
  children: any = []
): Record<string, any> => {
  return {
    el,
    tagName,
    attributes,
    children,
  };
};

export const textNode = (el: any, value: string): Record<string, any> => {
  return {
    el,
    value,
  };
};
