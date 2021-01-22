import { UnknownKV } from '../../models/generics';

import { arrayIndexCaptureRE } from './patterns';

export const computeExpression = (
  expression: string,
  el?: HTMLElement,
  returnable?: boolean
): Function => {
  let formattedExpression = `with($state){${
    returnable ?? true ? `return ${expression}` : expression
  }}`;
  return (state: UnknownKV) => {
    try {
      const strippedExpression = expression.replace(/(\[\d+\])|(\$state\.)|(\(\))|;*/gim, '');
      const positionInState = returnable ? Object.keys(state).indexOf(strippedExpression) : -1;

      // TODO: Add prop access (ex: key.prop)
      if (positionInState !== -1) {
        const value = Object.values(state)[positionInState];
        const arrayIndex = arrayIndexCaptureRE().exec(expression);
        if (
          arrayIndex &&
          arrayIndex[1] &&
          value instanceof Array &&
          !isNaN((arrayIndex[1] as unknown) as number)
        ) {
          // Compute array access by index
          return value[Number(arrayIndex[1])];
        } else if (expression.endsWith('()')) {
          // Call function
          return (value as Function)();
        } else return value;
      } else {
        return new Function('$state', '$el', formattedExpression)(state, el || null);
      }
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el || null);
    }
  };
};

export default computeExpression;
