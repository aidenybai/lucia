import { UnknownKV } from '../../models/generics';
import { Data } from '../../models/structs';

export const safeEval = (
  expression: string,
  argsKV: UnknownKV = {},
  bindKV: UnknownKV = {},
  returnable: boolean = true
): any => {
  // Use Function class to perform scoped string eval, wrap in with to provide
  // state keys as global properties.
  return new Function(
    ...Object.keys(argsKV),
    returnable ? `return ${expression}` : expression
  ).bind(bindKV)(...Object.values(argsKV));
};

export const computeProperties = (
  expression: string,
  data: Data,
  returnable: boolean = true
): any => {
  return safeEval(expression, { $el: data.$el }, data.$state, returnable);
};

export default computeProperties;
