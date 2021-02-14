import { DIRECTIVE_PREFIX } from '../../models/generics';
import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';
import adjustDeps from '../utils/adjustDeps';

export const ifDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const hydratedConditional = !!data.compute(state);

  if (!getElementCustomProp(node.el, '__l_if_template')) {
    const template = document.createElement('template');

    setElementCustomProp(template, '__l_if_template', true);
    template.content.appendChild(el.cloneNode(true));
    template.setAttribute(`${DIRECTIVE_PREFIX}if`, data.value);

    el.replaceWith(template);

    node.el = template;
  }

  const hasInserted = getElementCustomProp(node.el, '__l_has_inserted');

  if (!hydratedConditional && hasInserted) {
    node.el.nextElementSibling?.remove();
    setElementCustomProp(node.el, '__l_has_inserted', false);
  } else if (hydratedConditional) {
    if (!hasInserted) {
      const clone = (node.el as HTMLTemplateElement).content.cloneNode(true);
      node.el.parentElement?.insertBefore(clone, node.el.nextElementSibling);
      setElementCustomProp(node.el, '__l_has_inserted', true);
    }

    const nextEl = node.el.nextElementSibling as HTMLElement;

    nextEl.removeAttribute(`${DIRECTIVE_PREFIX}if`);

    const ast = compile(nextEl, state);
    const marker = getElementCustomProp(nextEl, '__l');

    if (!marker) adjustDeps(ast, data.deps, node, 'if');

    setElementCustomProp(nextEl, '__l', true);

    render(ast, directives, state, node.deps);
  }
};
