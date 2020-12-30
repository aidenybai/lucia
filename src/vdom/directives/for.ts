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
  const template = String(el.__l_for_template);
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
          let content = template;

          if (item)
            content = content.replace(
              expressionPropRE(item.trim()),
              `${target}[${currArray.length - i}]`
            );
          if (index)
            content = content.replace(expressionPropRE(index.trim()), String(currArray.length - i));

          temp.innerHTML = content;
          el.appendChild(temp.firstChild as HTMLElement);
        }
      }
    }
  }

  const scope = createApp({ ...app.state });

  Object.entries(app.directives || {}).map(([name, evaluationCallback]) => {
    scope.directive(name, evaluationCallback);
  });

  Object.entries(app.components || {}).map(([name, templateCallback]) => {
    scope.component(name, templateCallback);
  });

  scope.mount(el);
};
