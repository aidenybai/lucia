import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import patch from '../../core/patch';
import { directives } from '../../core/directive';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  // Handle naked prop in expression case
  el.innerHTML = data.compute(state) ?? data.value;

  const ast = compile(el, state);
  patch(ast, directives, state, data.deps);
};
