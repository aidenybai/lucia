import { UnknownKV } from '../../models/generics';
import { MagicProps } from '../../models/structs';

const functionCache = new Map<[string, MagicProps, boolean], Function>();

export const createFunction = (expression: string, magicProps: MagicProps, returnable = true) => {
  return new Function('$', ...Object.keys(magicProps), returnable ? `return ${expression}` : expression);
}

export const computeExpression = (
  expression: string,
  magicProps: MagicProps,
  returnable: boolean = true
): any => {
  if (functionCache.has([expression, magicProps, returnable])) {
    //@ts-ignore
    return (state: UnknownKV) => functionCache.get([expression, magicProps, returnable])(state, ...Object.values(magicProps));
  } else {
    functionCache.set([expression, magicProps, returnable], createFunction(expression, magicProps, returnable));
    //@ts-ignore
    return (state: UnknownKV) => functionCache.get([expression, magicProps, returnable])(state, ...Object.values(magicProps));
  }
};

export default computeExpression;
