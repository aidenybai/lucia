const wrapIIFE = (payload: string): string => {
  return `(function(){${payload}})()`;
};

const createVariable = (keys: string[]): string => {
  return `var {${keys.join(',')}}=data;`;
}

const createFunction = (value: Function) => {
  return `function ${value.toString().replace(/this\./g, 'data.')}`
}

const compose = (raw: string, data: any, output: boolean = true): any => {
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
  return eval(wrapIIFE(payload));
};

export default compose;
