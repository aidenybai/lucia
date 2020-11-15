export const DIRECTIVE_PREFIX = 'l-';

export const props = (el: Record<string, any>): Record<string, any> => {
  const attributes: Record<string, any> = {};
  const directives: Record<string, any> = {};

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = value;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export default props;
