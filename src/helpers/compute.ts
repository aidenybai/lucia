const computeProperties = (expression: string, _: unknown, returnable: boolean = true): any => {
  return new Function(`with(this) {${returnable ? `return ${expression}` : expression}}`).bind(_)();
};

export default computeProperties;
