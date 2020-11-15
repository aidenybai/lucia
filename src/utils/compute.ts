const computeProperties = (
  expression: string,
  view: unknown = {},
  returnable: boolean = true
): any => {
  return new Function(`with(this) {${returnable ? `return ${expression}` : expression}}`).bind(
    view
  )();
};

export default computeProperties;
