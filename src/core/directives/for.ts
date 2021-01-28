import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import patch from '../../core/patch';
import { directives } from '../../core/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';

export const forDirective = ({ el, data, state }: DirectiveProps) => {
  const [expression, target] = data.value.split(/in +/g);
  const [item, index] = expression.replace(parenthesisWrapReplaceRE(), '').split(',');
  const currArray = state[target] as unknown[];

  // @ts-ignore
  let template = String(el.__l_for_template);
  if (el.innerHTML.trim() === template) el.innerHTML = '';

  const arrayDiff = currArray.length - el.children.length;

  if (currArray.length === 0) el.innerHTML = '';
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

  // @ts-ignore
  el.__l = true;
  const ast = compile(el, state);
  patch(ast, directives, state, data.deps);
};
