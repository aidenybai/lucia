import { DirectiveProps } from '../../models/structs';

import compile from '../../dream/compile';
import patch from '../../dream/patch';
import { directives } from '../../dream/directive';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  const key = data.value.replace(/(;)/gim, '');
  if (key in state) el.innerHTML = String(state[key]);
  el.innerHTML = data.compute(state) ?? data.value;

  // @ts-ignore
  el.__l = {};
  const ast = compile(el, state);
  patch(ast, directives, state, data.keys);
};
