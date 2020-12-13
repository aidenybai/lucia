import { UnknownKV } from '../../models/generics';
import { Data } from '../../models/structs';

export const safeEval = (
  expression: string,
  argsKV: UnknownKV = {},
  bindKV: UnknownKV = {},
  returnable: boolean = true
): any => {
  // Use Function class to perform scoped string eval, wrap in with to provide
  // view keys as global properties.
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
  return safeEval(expression, { $el: data.$el }, data.$view, returnable);
};

export default computeProperties;
