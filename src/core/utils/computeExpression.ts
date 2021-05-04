import { KV } from '@models/generics';
import { Refs } from '@models/structs';
import { expressionPropRE } from './patterns';

export const resolveStateInExpression = (
  unresolvedExpression: string,
  deps: string[] = []
): string => {
  // This dynamically appends `$state.` to the front of standalone props, allowing the
  // user to write less and us to compile and run faster without with() {}
  let expression = unresolvedExpression;
  deps.forEach((dep) => {
    if (dep !== expression) expression = expression.replace(expressionPropRE(dep), `$state.${dep}`);
  });
  return expression;
};

export const computeExpression = (
  expression: string,
  el?: HTMLElement,
  returnable = true,
  refs: Refs = {},
  deps?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((state: KV<unknown>, event?: Event) => any) => {
  const formattedExpression = `${returnable ? `return ${expression}` : expression}`;
  const resolvedExpression = resolveStateInExpression(formattedExpression, deps);
  const specialPropertiesNames = ['$state', '$el', '$emit', '$event', '$refs'];

  // This "revives" a function from a string, only using the new Function syntax once during compilation.
  // This is because raw function is ~50,000x faster than new Function
  const computeFunction = new Function(
    `'use strict';return function(${specialPropertiesNames.join(',')}){${resolvedExpression}}`
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
        return computeFunction(state, el, emit, event, refs);
      }
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
    }
  };
};

export default computeExpression;
