export const DIRECTIVE_PREFIX = 'l-';

export const props = (el: Element | null): Record<string, Record<string, string>> => {
  const attributes: Record<string, string> = {};
  const directives: Record<string, string> = {};

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
