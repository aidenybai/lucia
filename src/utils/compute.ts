export const wrapScope = (payload: string): string => {
  return `(function(){${payload}})()`;
};

export const createVariable = (name: string): string => {
  return `var ${name}=data.${name};`;
};

export const createFunction = (value: Function): string => {
  return `function ${value.toString().replace(/this\./g, 'data.')}`;
};

export const noop = (..._args: any) => {};

export const computeProperties = (
  expression: string,
  properties: any,
  returnable: boolean = true
): any => {
  // try {
    let payload = '';

    for (const key in properties) {
      if (typeof properties[key] === 'function') {
        payload += createFunction(properties[key]);
      } else {
        payload += createVariable(key);
      }
    }

    if (returnable) payload += `return ${expression}`;
    else payload += `${expression}`;

    return eval(wrapScope(payload));
  // } catch (err) {
  //   noop(err);
  // }
};

export default computeProperties;
