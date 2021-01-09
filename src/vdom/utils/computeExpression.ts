import { UnknownKV } from '../../models/generics';
import { MagicProps } from '../../models/structs';

export const computeExpression = (
  expression: string,
  magicProps: MagicProps,
  returnable: boolean = true
): any => {
  // @ts-ignore
  const formattedExpression = returnable ? `return ${expression}` : expression;
  // @ts-ignore
  const [magicPropsKeys, magicPropsValues] = [Object.keys(magicProps), Object.values(magicProps)];

  // @ts-ignore
  return (state: UnknownKV) => {
    try {
      // return new Function('return 1')();
      return new Function('$', ...magicPropsKeys, formattedExpression)(state, ...magicPropsValues);
    } catch (err) {
      console.warn(
        `Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`,
        magicProps.$el
      );
    }
  };
};

export default computeExpression;
