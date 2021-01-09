import { UnknownKV } from '../../models/generics';
import { MagicProps } from '../../models/structs';

export const computeExpression = (
  expression: string,
  magicProps: MagicProps,
  returnable: boolean = true
): any => {
  const formattedExpression = returnable ? `return ${expression}` : expression;
      const [magicPropsKeys, magicPropsValues] = [
        Object.keys(magicProps),
        Object.values(magicProps),
      ];
  return (state: UnknownKV) => {
    try {
      

      return new Function("$", ...magicPropsKeys, formattedExpression)(state, ...magicPropsValues);
    } catch (err) {
      console.warn(
        `Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`,
        magicProps.$el
      );
    }
  };
};

export default computeExpression;
