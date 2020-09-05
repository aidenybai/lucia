const wrapIIFE = (payload: string): string => {
  return `(function(){${payload}})()`;
};

const createVariable = (name: string): string => {
  return `var ${name}=data.${name};`;
}

const createFunction = (value: Function) => {
  return `function ${value.toString().replace(/this\./g, 'data.')}`
}

const compose = (raw: string, data: any, output: boolean = true): any => {
  let payload = '';
  for (const key in data) {
    if (typeof data[key] === 'function') {
      payload += createFunction(data[key]);
    } else {
      payload += createVariable(key);
    }
  }
  if (output) payload += `return ${raw}`;
  else payload += `${raw}`;
  return eval(wrapIIFE(payload));
};

export default compose;
