const wrapScope = (expression: string): string => {
  return `(function(){with(_){${expression}}})()`;
};

const computeProperties = (expression: string, _: unknown, returnable: boolean = true): any => {
  return eval(wrapScope(returnable ? `return ${expression}` : expression));
};

export default computeProperties;
