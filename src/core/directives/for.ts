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
  node = node!;
  const marker = getElementCustomProp(el, 'component');

  setElementCustomProp(el, 'component', true);

  const [expression, target] = data.value.split(/\s+(?:in|of)\s+/gim);
  const [item, index] = expression?.trim().replace(parenthesisWrapReplaceRE(), '').split(',');
  const currArray =
    (state[target?.trim()] as unknown[]) ?? computeExpression(target?.trim(), el, true)(state);
  const ast = compile(el, state);

  let template = getElementCustomProp(el, '__for_template');
  if (el.innerHTML.trim() === template) el.innerHTML = '';

  const arrayDiff = currArray?.length - el.children.length;

  if (currArray?.length === 0) el.innerHTML = '';
  else if (arrayDiff !== 0) {
    for (let i = Math.abs(arrayDiff); i > 0; i--) {
      if (arrayDiff < 0) el.removeChild(el.lastChild as Node);
      else {
        // Handle table cases
        const tag = template.startsWith('<th')
          ? 'thead'
          : template.startsWith('<td') || template.startsWith('<tr')
          ? 'tbody'
          : 'div';

        const temp = document.createElement(tag);
        let content = template;

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

        temp.innerHTML = content;

        el.appendChild(temp.firstElementChild!);
      }
    }
  }

  if (!marker) {
    adjustDeps(ast, data.deps, node, 'for');
    el.removeAttribute(`${DIRECTIVE_PREFIX}for`);
  }

  render(compile(el, state), directives, state, node.deps);
};
