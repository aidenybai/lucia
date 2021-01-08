import { UnknownKV } from '../../models/generics';
import { MagicProps } from '../../models/structs';

export const computeExpression = (
  expression: string,
  magicProps: MagicProps,
  returnable: boolean = true
): any => {
  return (state: UnknownKV) => {
    try {
      const formattedExpression = returnable ? `return ${expression}` : expression;
      const [magicPropsKeys, magicPropsValues] = [
        Object.keys(magicProps),
        Object.values(magicProps),
      ];

      return new Function(...magicPropsKeys, formattedExpression).bind(state)(...magicPropsValues);
    } catch (err) {
      console.warn(
        `Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`,
        magicProps.$el
      );
    }
  };
};

export default computeExpression;
