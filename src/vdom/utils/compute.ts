import { UnknownKV } from '../../models/generics';
import { Data } from '../../models/structs';

interface safeEvalArgs {
  expression: string;
  argsKV: UnknownKV;
  returnable: boolean;
}

export const safeEval = (
  expression: string,
  argsKV: UnknownKV = {},
  returnable: boolean = true
): Function => {
  // Use Function class to perform scoped string eval, wrap in with to provide
  // state keys as global properties.
  function run(this: safeEvalArgs, state: UnknownKV) {
    const expression = this.returnable ? `return ${this.expression}` : this.expression;
    return new Function(...Object.keys(this.argsKV), expression).bind(state)(
      ...Object.values(this.argsKV)
    );
  }

  return run.bind({ expression, argsKV, returnable });
};

export const computeExpression = (
  expression: string,
  data: Data,
  returnable: boolean = true
): any => {
  try {
    return safeEval(expression, { $el: data.$el }, returnable);
  } catch (err) {
    console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, data.$el);
  }
};

export default computeExpression;
