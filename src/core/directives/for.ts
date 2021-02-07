import { DirectiveProps } from '../../models/structs';

import compile from '../../core/compile';
import render from '../../core/render';
import { directives } from '../../core/directive';

import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';
import { getCustomProp, setCustomProp } from '../utils/customProp';

export const removeDupesFromArray = (array: any[]): any[] => [...new Set(array)];

export const forDirective = ({ el, data, state, node }: DirectiveProps) => {
  const marker = getCustomProp(el, '__l');

  setCustomProp(el, '__l', true);

  const [expression, target] = data.value.split(/in +/g);
  const [item, index] = expression.replace(parenthesisWrapReplaceRE(), '').split(',');
  const currArray = state[target] as unknown[];
  const ast = compile(el, state);

  let template = getCustomProp(el, '__l_for_template');
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

  if (!marker) {
    const deps = [];

    for (const childNode of ast) {
      deps.push(...childNode.deps);
    }

    const cleanedDeps = removeDupesFromArray([...data.deps, ...deps]);

    node!.deps = cleanedDeps;
    node!.directives.for.deps = cleanedDeps;
  }

  render(marker ? ast : compile(el, state), directives, state, node!.deps);
};
