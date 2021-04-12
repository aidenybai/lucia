import { UnknownKV } from '../../models/generics';
import { Refs } from '../../models/structs';
import { expressionPropRE } from './patterns';

export const computeExpression = (
  expression: string,
  el?: HTMLElement,
  returnable = true,
  refs: Refs = {},
  deps: string[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((state: UnknownKV, event?: Event) => any) => {
  // This dynamically appends `$state.` to the front of standalone props, allowing the
  // user to write less and us to compile and run faster without with() {}
  let formattedExpression = `${returnable ? `return ${expression}` : expression}`;
  deps.forEach((dep) => {
    formattedExpression = formattedExpression.replace(expressionPropRE(dep), `$state.${dep}`);
  });
  return (state: UnknownKV, event?: Event) => {
    try {
      const value = state[expression];
      if (value) {
        // @ts-expect-error: state[expression] is a function
        return typeof value === 'function' ? state[expression]() : value;
      } else {
        const emit = (name: string, options?: CustomEventInit, dispatchGlobal = true) => {
          const event = new CustomEvent(name, options);
          const target = dispatchGlobal ? window : el || window;
          target.dispatchEvent(event);
        };

        const specialProperties = {
          $state: state,
          $el: el,
          $emit: emit,
          $event: event,
          $refs: refs,
        };

        return new Function(...Object.keys(specialProperties), formattedExpression)(
          ...Object.values(specialProperties)
        );
      }
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
    }
  };
};

export default computeExpression;
