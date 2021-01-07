import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';
import { expressionPropRE, parenthesisWrapReplaceRE } from '../utils/patterns';

export const forDirective = ({ el, data, app }: DirectiveProps) => {
  // Doesn't handle dupe items in array correctly

  const [expression, target] = data.value.split(/in +/g);
  const [item, index] = expression.replace(parenthesisWrapReplaceRE(), '').split(',');
  const currArray = [...compute(target, { $el: el })(app.state)];

  // @ts-ignore
  let template = String(el.__l_for_template);
  if (template.trim() === '') {
    el.innerHTML = currArray.join('');
  } else {
    if (el.innerHTML.trim() === template) el.innerHTML = '';

    const arrayDiff = currArray.length - el.children.length;
    if (arrayDiff !== 0) {
      for (let i = Math.abs(arrayDiff); i > 0; i--) {
        if (arrayDiff < 0) el.removeChild(el.lastChild as Node);
        else {
          const temp = document.createElement('div');
          const contentStart = item
            ? template.replace(expressionPropRE(item.trim()), `${target}[${currArray.length - i}]`)
            : template;
          const content = index
            ? contentStart.replace(expressionPropRE(index.trim()), String(currArray.length - i))
            : contentStart;

          temp.innerHTML = content;
          el.appendChild(temp.firstChild as HTMLElement);
        }
      }
    }
  }

  const scope = createApp({ ...app.state });

  for (const [name, evaluationCallback] of Object.entries(app.directives || {})) {
    scope.directive(name, evaluationCallback);
  }

  for (const [name, templateCallback] of Object.entries(app.components || {})) {
    scope.component(name, templateCallback);
  }

  scope.mount(el);
};
