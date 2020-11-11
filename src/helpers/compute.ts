const computeProperties = (
  expression: string,
  view: unknown = {},
  returnable: boolean = true
): any => {
  return new Function(`${returnable ? `return ${expression}` : expression}`).bind(view)();
};

export default computeProperties;
