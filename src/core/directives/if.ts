import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { getCustomProp, setCustomProp } from '../utils/customProp';

export const ifDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const hydratedConditional = !!data.compute(state);

  if (!getCustomProp(node.el, '__l_if_template')) {
    const template = document.createElement('template');

    setCustomProp(template, '__l_if_template', true);
    template.content.appendChild(el.cloneNode(true));
    el.replaceWith(template);

    node.el = template;
  }

  const hasInserted = getCustomProp(node.el, '__l_if_has_inserted');

  if (!hydratedConditional && hasInserted) {
    node.el.nextElementSibling?.remove();
    setCustomProp(node.el, '__l_has_inserted', false);
  } else if (hydratedConditional && !hasInserted) {
    const clone = (node.el as HTMLTemplateElement).content.cloneNode(true);
    node.el.parentElement?.insertBefore(clone, node.el.nextElementSibling);
    setCustomProp(node.el, '__l_has_inserted', true);

    const nextEl = node.el.nextElementSibling as HTMLElement;
    nextEl.removeAttribute('l-if');

    const ast = compile(nextEl, state);
    render(ast, directives, state, Object.keys(state));
  }
};
