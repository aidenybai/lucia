import { DirectiveProps } from '../../models/structs';

import compile from '../../dream/compile';
import patch from '../../dream/patch';
import { directives } from '../../dream/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';

export const forDirective = ({ el, data, state }: DirectiveProps) => {
  // Doesn't handle dupe items in array correctly

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
        const temp = document.createElement('div');
        let content = template;

        if (item) {
          content = content.replace(
            expressionPropRE(item.trim()),
            `${target}[${currArray.length - i}]`
          );
        }

        if (index) {
          content = content.replace(expressionPropRE(index.trim()), String(currArray.length - i));
        }

        temp.innerHTML = content;
        el.appendChild(temp.firstChild as HTMLElement);
      }
    }
  }

  // @ts-ignore
  el.__l = {};
  const ast = compile(el, state);
  patch(ast, directives, state, data.keys);
};
