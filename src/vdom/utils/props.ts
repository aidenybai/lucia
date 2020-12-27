import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS, StringKV } from '../../models/generics';
import { DirectiveKV } from '../../models/structs';

import compute from '../utils/compute';

export const props = (el: HTMLElement): Record<string, StringKV | DirectiveKV> => {
  const attributes: StringKV = {};
  const directives: DirectiveKV = {};

  // Seperate directives and attributes
  if (el.attributes) {
    for (const { name, value } of [...el.attributes]) {
      // @ts-ignore
      if (name.includes('for') && el.__l_for === undefined) {
        // @ts-ignore
        el.__l_for = String(el.innerHTML).trim();
      }
      const directiveData = { compute: compute(value, { $el: el }), value };
      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = directiveData;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
        directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = directiveData;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export default props;
