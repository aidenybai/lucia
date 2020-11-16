const computeProperties = (
  expression: string,
  data: Record<string, any> = {},
  returnable: boolean = true
): any => {
  return new Function(
    `with(${Object.keys(data).length === 0 ? 'this' : 'this.$view'}) {${
      returnable ? `return ${expression}` : expression
    }}`
  ).bind(data)();
};

export default computeProperties;
