import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { getCustomProp, setCustomProp } from '../utils/customProp';
import adjustDeps from '../utils/adjustDeps';

export const htmlDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const marker = getCustomProp(el, '__l');

  // Handle naked prop in expression case
  el.innerHTML = data.compute(state) ?? data.value;

  const ast = compile(el, state, true);

  if (!marker) adjustDeps(ast, data.deps, node, 'html');

  render(ast, directives, state, data.deps);

  setCustomProp(el, '__l', true);
};
