const computeProperties = (expression: string, _: unknown, returnable: boolean = true): any => {
  return new Function(returnable ? `return ${expression}` : expression).bind(_);
};

export default computeProperties;
