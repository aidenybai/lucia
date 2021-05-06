import { KV } from '@models/generics';
import { Refs } from '@models/structs';

export const computeExpression = (
  expression: string,
  el?: HTMLElement,
  returnable = true,
  refs: Refs = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((state: KV<unknown>, event?: Event) => any) => {
  const formattedExpression = `${returnable ? `return ${expression}` : expression}`;
  // @ts-expect-error: LuciaSpecialProperties doesn't exist on window, but we create it.
  const customGlobalSpecialProperties = window.LuciaSpecialProperties || {};
  const specialPropertiesNames = [
    '$state',
    '$el',
    '$emit',
    '$event',
    '$refs',
    ...Object.keys(customGlobalSpecialProperties),
  ];

  // This "revives" a function from a string, only using the new Function syntax once during compilation.
  // This is because raw function is ~50,000x faster than new Function
  const computeFunction = new Function(
    `return function(${specialPropertiesNames.join(',')}){with($state){${formattedExpression}}}`
  )();

  const emit = (name: string, options?: CustomEventInit, dispatchGlobal = true) => {
    const event = new CustomEvent(name, options);
    const target = dispatchGlobal ? window : el || window;
    target.dispatchEvent(event);
  };

  return (state: KV<unknown>, event?: Event) => {
    try {
      const value = state[expression];
      if (value) {
        return typeof value === 'function' ? value.bind(state)() : value;
      } else {
        return computeFunction(
          state,
          el,
          emit,
          event,
          refs,
          ...Object.values(customGlobalSpecialProperties)
        );
      }
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
    }
  };
};

export default computeExpression;
