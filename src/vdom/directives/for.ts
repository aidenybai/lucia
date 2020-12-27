import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const forDirective = ({ el, data, app }: DirectiveProps) => {
  const [expression, target] = data.value.split(/in +/g);
  const [item, index] = expression.split(',');
  const hydratedArray = compute(target, { $el: el })(app.state);

  // @ts-ignore
  const template = String(el.__l_for);
  if (template) {
    let accumulator = '';

    for (let i = 0; i < hydratedArray.length; i++) {
      let content = template;
      if (item)
        content = content.replace(new RegExp(`this.${item.trim()}`, 'g'), `${target}[${i}]`);
      if (index) content = content.replace(new RegExp(`this.${index.trim()}`, 'g'), String(i));
      accumulator += content;
    }

    el.innerHTML = accumulator;
  } else {
    el.innerHTML = hydratedArray.join('');
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
