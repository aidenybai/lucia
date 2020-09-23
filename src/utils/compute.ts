const wrapScope = (expression: string): string => {
  return `(function(){with(_data){${expression}}})()`;
};

const computeProperties = (expression: string, _data: any, returnable: boolean = true): any => {
  return eval(wrapScope(returnable ? `return ${expression}` : expression));
};

export default computeProperties;
