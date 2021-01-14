import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '../../models/generics';
import { DirectiveKV, State } from '../../models/structs';
import { eventDirectivePrefixRE, expressionPropRE } from './patterns';

import computeExpression from './computeExpression';

export const removeDupesFromArray = (array: any[]): any[] => [...new Set(array)];

export const collectAndInitDirectives = (
  el: HTMLElement,
  state: State = {}
): (DirectiveKV | string[])[] => {
  const directives: DirectiveKV = {};
  const nodeKeys = [];

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      const keysInFunctions: string[] = [];
      const keysInState: string[] = Object.keys(state);
      let returnable = true;

      // Finds the dependencies of a directive expression
      const keys: string[] = keysInState.filter((key) => {
        const hasKey = expressionPropRE(key).test(String(value));

        if (typeof state[key] === 'function' && hasKey) {
          const keysInFunction = keysInState.filter((k) =>
            expressionPropRE(k).test(String(state[key]))
          );
          keysInFunctions.push(...keysInFunction);
        }

        return hasKey;
      });

      if (eventDirectivePrefixRE().test(name)) returnable = false;
      // @ts-ignore
      if (name.includes('for') && el.__l_for_template === undefined) {
        // @ts-ignore
        el.__l_for_template = String(el.innerHTML).trim();
        returnable = false;
      }

      const uniqueCompiledKeys = removeDupesFromArray([...keys, ...keysInFunctions]);
      nodeKeys.push(...uniqueCompiledKeys);

      const directiveData = {
        compute: computeExpression(value, el, returnable),
        keys: uniqueCompiledKeys,
        value,
      };

      // Handle normal and shorthand directives
      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = directiveData;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
        directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = directiveData;
      }
    }
  }
  return [directives, removeDupesFromArray(nodeKeys)];
};

export default collectAndInitDirectives;
