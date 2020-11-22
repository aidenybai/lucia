export const DIRECTIVE_PREFIX = 'l-';

export const props = (el: Element | null): Record<string, any> => {
  const attributes: Record<string, any> = {};
  const directives: Record<string, any> = {};

  el = el as Element;

  if (el.attributes) {
    for (const { name, value } of Array.prototype.slice.call(el.attributes)) {
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
