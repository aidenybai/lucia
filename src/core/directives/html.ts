import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';
import adjustDeps from '../utils/adjustDeps';

export const htmlDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const marker = getElementCustomProp(el, 'component');

  // Handle naked prop in expression case
  el.innerHTML = data.compute(state) ?? data.value;

  const ast = compile(el, state, true);

  if (!marker) adjustDeps(ast, data.deps, node, 'html');

  render(ast, directives, state, data.deps);

  setElementCustomProp(el, 'component', true);
};
