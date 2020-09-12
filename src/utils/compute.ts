export const wrapScope = (expressions: string): string => {
  return `(function(){with(_data){${expressions}}})()`;
};

export const computeProperties = (
  expression: string,
  _data: any,
  returnable: boolean = true
): any => {
  return eval(wrapScope(returnable ? `return ${expression}` : expression));
};

export default computeProperties;
