import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS, StringKV } from '../../models/generics';

export const props = (el: HTMLElement): Record<string, StringKV> => {
  const attributes: StringKV = {};
  const directives: StringKV = {};

  if (el.attributes) {
    for (const { name, value } of [...el.attributes]) {
      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = value;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
        directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = value;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export default props;
