export const createScope = (payload: string): string => {
  return `(function(){${payload}})()`;
};

export const createVariable = (keys: string[]): string => {
  return `var {${keys.join(',')}}=data;`;
};

export const createFunction = (value: Function): string => {
  return `function ${value.toString().replace(/this\./g, 'data.')}`;
};

export const compose = (raw: string, data: any, output: boolean = true): any => {
  let payload = '';
  let dataKeys = [];
  for (const key in data) {
    if (typeof data[key] === 'function') {
      payload += createFunction(data[key]);
    } else {
      dataKeys.push(key);
    }
  }
  payload += createVariable(dataKeys);

  if (output) payload += `return ${raw}`;
  else payload += `${raw}`;

  return eval(createScope(payload));
};

export default compose;
