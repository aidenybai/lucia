import { DirectiveProps } from '../../models/structs';

import compile from '../../vdom/compile';
import patch from '../../vdom/patch';
import { directives } from '../../vdom/directive';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  const key = data.value.replace(/(;)/gim, '');
  if (key in state) el.innerHTML = String(state[key]);
  el.innerHTML = data.compute(state) ?? data.value;

  // @ts-ignore
  el.__l = {};
  const vdom = compile(el, state);
  patch(vdom, directives, state, data.keys);
};
