import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  // Handle naked prop in expression case
  el.innerHTML = data.compute(state) ?? data.value;

  const ast = compile(el, state);
  render(ast, directives, state, data.deps);
};
