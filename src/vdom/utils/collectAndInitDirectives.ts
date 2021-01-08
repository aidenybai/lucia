import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '../../models/generics';
import { DirectiveKV, State } from '../../models/structs';
import { eventDirectivePrefixRE, expressionPropRE } from './patterns';

import computeExpression from './computeExpression';

export const collectAndInitDirectives = (el: HTMLElement, state: State = {}): DirectiveKV => {
  const directives: DirectiveKV = {};

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      let returnable = true;
      let keysInFunctions: string[] = [];

      let keys: string[] = Object.keys(state).filter((key) => {
        const hasKey = expressionPropRE(key).test(String(value));

        if (typeof state[key] === 'function' && hasKey) {
          const keysInFunction = Object.keys(state).filter((k) =>
            expressionPropRE(k).test(String(state[key]))
          );
          keysInFunctions = [...keysInFunctions, ...keysInFunction];
        }
        return hasKey;
      });
      let allKeys = [...new Set([...keys, ...keysInFunctions])]; // Removes duplicates

      if (eventDirectivePrefixRE().test(name)) returnable = false;
      // @ts-ignore
      if (name.includes('for') && el.__l_for_template === undefined) {
        // @ts-ignore
        el.__l_for_template = String(el.innerHTML).trim();
        returnable = false;
      }

      const directiveData = {
        compute: computeExpression(value, { $el: el }, returnable),
        keys: allKeys,
        value,
      };

      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = directiveData;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
        directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = directiveData;
      }
    }
  }
  return directives;
};

export default collectAndInitDirectives;
