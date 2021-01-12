import { UnknownKV } from '../../models/generics';
import { MagicProps } from '../../models/structs';

import { arrayIndexCaptureRE } from './patterns';

export const computeExpression = (
  expression: string,
  magicProps: MagicProps,
  returnable: boolean = true
): any => {
  let formattedExpression = `with($state){${returnable ? `return ${expression}` : expression}}`;
  const [magicPropsKeys, magicPropsValues] = [Object.keys(magicProps), Object.values(magicProps)];
  return (state: UnknownKV) => {
    try {
      const strippedExpression = expression.replace(/(\[\d+\])|(\$state\.)|(\(\))|;*/gim, '');
      const positionInState = returnable ? Object.keys(state).indexOf(strippedExpression) : -1;

      if (positionInState !== -1) {
        const value = Object.values(state)[positionInState];
        const arrayIndex = arrayIndexCaptureRE().exec(expression);
        if (
          arrayIndex &&
          arrayIndex[1] &&
          value instanceof Array &&
          !isNaN((arrayIndex[1] as unknown) as number)
        ) {
          return value[Number(arrayIndex[1])];
        } else if (expression.endsWith('()')) {
          return (value as Function)();
        } else return value;
      } else {
        return new Function('$state', ...magicPropsKeys, formattedExpression)(
          state,
          ...magicPropsValues
        );
      }
    } catch (err) {
      console.warn(
        `Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`,
        magicProps.$el
      );
    }
  };
};

export default computeExpression;
