import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';
import { getCustomProp, setCustomProp } from '../utils/customProp';
import adjustDeps from '../utils/adjustDeps';

export const forDirective = ({ el, data, state, node }: DirectiveProps) => {
  node = node!;
  const marker = getCustomProp(el, '__l');

  setCustomProp(el, '__l', true);

  const [expression, target] = data.value.split(/\s+(?:in|of)\s+/gim);
  const [item, index] = expression?.trim().replace(parenthesisWrapReplaceRE(), '').split(',');
  const currArray = state[target?.trim()] as unknown[];
  const ast = compile(el, state);

  let template = getCustomProp(el, '__l_for_template');
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

  if (!marker) adjustDeps(ast, data.deps, node, 'for');

  render(compile(el, state), directives, state, node.deps);
};
