/* istanbul ignore file */

import { DIRECTIVE_PREFIX } from '../../models/generics';
import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';
import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';
import adjustDeps from '../utils/adjustDeps';
import computeExpression from '../utils/computeExpression';

export const forDirective = ({ el, data, state, node }: DirectiveProps) => {
  const marker = getElementCustomProp(el, 'component');

  setElementCustomProp(el, 'component', true);

  const [expression, target] = data.value.split(/\s+(?:in|of)\s+/gim);
  const [item, index] = expression?.trim().replace(parenthesisWrapReplaceRE(), '').split(',');

  const currArray =
    (state[target?.trim()] as unknown[]) ?? computeExpression(target?.trim(), el, true)(state);
  const ast = compile(el, state);

  const template = getElementCustomProp(el, '__for_template');
  if (el.innerHTML.trim() === template) el.innerHTML = '';

  // for directive is size-based, not content-based, since everything is compiled and rerendered
  const arrayDiff = currArray?.length - el.children.length;

  if (currArray?.length === 0) el.innerHTML = '';
  else if (arrayDiff !== 0) {
    for (let i = Math.abs(arrayDiff); i > 0; --i) {
      if (arrayDiff < 0) el.removeChild(el.lastChild as Node);
      else {
        let content = String(template);
        const isTable = /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(content);

        if (item) {
          content = content.replace(
            expressionPropRE(`this\\.${item.trim()}`),
            `${target}[${currArray.length - i}]`
          );
        }
        if (index) {
          content = content.replace(
            expressionPropRE(`this\\.${index.trim()}`),
            String(currArray.length - i)
          );
        }

        // Needing to wrap table elements, else they disappear
        if (isTable) content = `<table>${content}</table>`;

        const fragment = document.createRange().createContextualFragment(content)
          .firstElementChild!;

        // fragment and fragment.firstElementChild return the same result
        // so we have to do it two times for the table, since we need
        // to unwrap the temporary wrap
        el.appendChild(isTable ? fragment.firstElementChild! : fragment);
      }
    }
  }

  if (!marker) {
    // Deps recompiled because child nodes may have additional deps
    adjustDeps(ast, data.deps, node!, 'for');
    el.removeAttribute(`${DIRECTIVE_PREFIX}for`);
  }

  render(compile(el, state, true), directives, state, node!.deps);
};
