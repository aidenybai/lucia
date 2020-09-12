export const wrapScope = (payload: string): string => {
  return `(function(){${payload}})()`;
};

export const createVariables = (variables: string[], properties: ProxyConstructor | any): string => {
  return `var {${variables.join(',')}}=JSON.parse('${JSON.stringify(properties)}');`;
};

export const createFunction = (value: Function): string => {
  return `function ${value.toString().replace(/this\./g, 'data.')}`;
};

export const noop = (..._args: any) => {};

export const computeProperties = (
  expression: string,
  properties: ProxyConstructor | any,
  returnable: boolean = true
): any => {
  let payload = '';
  let variables = [];

  for (const key in properties) {
    if (typeof properties[key] === 'function') {
      payload += createFunction(properties[key]);
    } else {
      variables.push(key);
    }
  }

  payload += createVariables(variables, properties);

  if (returnable) payload += `return ${expression}`;
  else payload += `${expression}`;

  return eval(wrapScope(payload));
};

export default computeProperties;
