/* istanbul ignore file */

import { DIRECTIVE_PREFIX } from '../../models/generics';
import { ASTNode, DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';
import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';
import adjustDeps from '../utils/adjustDeps';
import computeExpression from '../utils/computeExpression';

// This directive is size-based, not content-based, since everything is compiled and rerendered

export const forDirective = ({ el, data, state, node }: DirectiveProps): void => {
  const marker = getElementCustomProp(el, 'component');
  if (!marker) setElementCustomProp(el, 'component', compile(el, state));

  const forLoopRE = /\s+(?:in|of)\s+/gim;
  const [expression, target] = data.value.split(forLoopRE);
  const [item, index] = expression?.trim().replace(parenthesisWrapReplaceRE(), '').split(',');

  // Try to grab by property, else compute it if it's a custom array
  const currArray =
    (state[target?.trim()] as unknown[]) ?? computeExpression(target?.trim(), el, true)(state);

  const template = getElementCustomProp(el, '__for_template');
  if (el.innerHTML.trim() === template) el.innerHTML = '';

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

        const fragment = document.createRange().createContextualFragment(content);

        // fragment and fragment.firstElementChild return the same result
        // so we have to do it two times for the table, since we need
        // to unwrap the temporary wrap
        // @ts-expect-error: firstElementChild will exist since <table> exists
        el.appendChild(isTable ? fragment.firstElementChild.firstElementChild : fragment);
      }
    }
    setElementCustomProp(el, 'component', compile(el, state));
  }

  if (!marker) {
    // Deps recompiled because child nodes may have additional deps
    adjustDeps(getElementCustomProp(el, 'component') as ASTNode[], data.deps, node!, 'for');
    el.removeAttribute(`${DIRECTIVE_PREFIX}for`);
  }

  // Only recompile if there is no increase/decrease, else use the original AST
  const ast = arrayDiff === 0 ? getElementCustomProp(el, 'component') : compile(el, state, true);
  render(ast as ASTNode[], directives, state, node!.deps);
};
