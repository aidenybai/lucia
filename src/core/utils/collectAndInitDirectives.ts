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
  const nodeDeps = [];

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      const depsInFunctions: string[] = [];
      const propsInState: string[] = Object.keys(state);
      let returnable = true;

      // Finds the dependencies of a directive expression
      const deps: string[] = propsInState.filter((prop) => {
        const hasDep = expressionPropRE(prop).test(String(value));

        if (typeof state[prop] === 'function' && hasDep) {
          const depsInFunction = propsInState.filter((p) =>
            expressionPropRE(p).test(String(state[prop]))
          );
          depsInFunctions.push(...depsInFunction);
        }

        return hasDep;
      });

      if (eventDirectivePrefixRE().test(name)) returnable = false;
      // @ts-ignore
      if (name.includes('for') && el.__l_for_template === undefined) {
        // @ts-ignore
        el.__l_for_template = String(el.innerHTML).trim();
        returnable = false;
      }

      const uniqueCompiledDeps = removeDupesFromArray([...deps, ...depsInFunctions]);
      nodeDeps.push(...uniqueCompiledDeps);

      const directiveData = {
        compute: computeExpression(value, el, returnable),
        deps: uniqueCompiledDeps,
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
  return [directives, removeDupesFromArray(nodeDeps)];
};

export default collectAndInitDirectives;
