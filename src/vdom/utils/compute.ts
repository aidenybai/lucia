import { UnknownKV } from '../../models/generics';
import { Data } from '../../models/structs';

interface computeFunctionArgs {
  expression: string;
  argsKV: UnknownKV;
  returnable: boolean;
}

function createComputeFunction(this: computeFunctionArgs, state: UnknownKV) {
  try {
    const expression = this.returnable ? `return ${this.expression}` : this.expression;

    // Magic properties (argsKV), passed as arguments so accessable as a scoped variable
    // State props (state), bound to function, accessable via `this`
    return new Function(...Object.keys(this.argsKV), expression).bind(state)(
      ...Object.values(this.argsKV)
    );
  } catch (err) {
    console.warn(
      `Lucia Error: "${err}"\n\nExpression: "${this.expression}"\nElement:`,
      this.argsKV.$el
    );
  }
}

export const compute = (expression: string, data: Data, returnable: boolean = true): any => {
  return createComputeFunction.bind({ expression, argsKV: { $el: data.$el }, returnable });
};

export default compute;
