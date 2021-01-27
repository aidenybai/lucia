import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import patch from '../../core/patch';
import { directives } from '../../core/directive';

export const ifDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const hydratedConditional = !!data.compute(state);

  // @ts-ignore
  if (!node.el.__l_if_template) {
    const template = document.createElement('template');

    // @ts-ignore
    template.__l_if_template = true;
    template.content.appendChild(el.cloneNode(true));
    el.replaceWith(template);

    node.el = template;
  }

  // @ts-ignore
  const hasInserted = node.el.__l_if_has_inserted;

  if (!hydratedConditional && hasInserted) {
    node.el.nextElementSibling?.remove();
    // @ts-ignore
    node.el.__l_if_has_inserted = false;
  } else if (hydratedConditional && !hasInserted) {
    const clone = (node.el as HTMLTemplateElement).content.cloneNode(true);
    node.el.parentElement?.insertBefore(clone, node.el.nextElementSibling);
    // @ts-ignore
    node.el.__l_if_has_inserted = true;

    const nextEl = node.el.nextElementSibling as HTMLElement;
    nextEl.removeAttribute('l-if');

    const ast = compile(nextEl, state);
    patch(ast, directives, state, Object.keys(state));
  }
};
