import { DirectiveProps } from '../../models/structs';
import { semicolonCaptureRE } from '../utils/patterns';

import compile from '../../core/compile';
import patch from '../../core/patch';
import { directives } from '../../core/directive';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  // Handle naked key in expression case
  const key = data.value.replace(semicolonCaptureRE(), '');
  if (key in state) el.innerHTML = String(state[key]);
  el.innerHTML = data.compute(state) ?? data.value;

  // @ts-ignore
  el.__l = {};
  const ast = compile(el, state);
  patch(ast, directives, state, data.keys);
};
