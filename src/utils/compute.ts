const computeProperties = (
  expression: string,
  data: Record<string, unknown> = {},
  returnable: boolean = true
): any => {
  // Use Function class to perform scoped string eval, wrap in with to provide
  // view keys as global properties. Accept normal eval if this.$view is not
  // provided in the data parameter
  return new Function(
    `with(${Object.keys(data).length === 0 ? 'this' : 'this.$view'}){${
      // Return if requested
      returnable ? `return ${expression}` : expression
    }}`
  ).bind(data)();
};

export default computeProperties;
