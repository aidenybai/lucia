const wrapScope = (expression: string): string => {
  return `(function(){with(_view){${expression}}})()`;
};

const computeProperties = (expression: string, _view: any, returnable: boolean = true): any => {
  return eval(wrapScope(returnable ? `return ${expression}` : expression));
};

export default computeProperties;
