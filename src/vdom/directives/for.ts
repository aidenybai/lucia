import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const forDirective = ({ el, data, app }: DirectiveProps) => {
  const [item, target] = data.value.split(/ +in +/g);
  const hydratedArray = compute(target, { $el: el })(app.state);
  const template = el.innerHTML;
  if (template) {
    let accumulator = '';

    for (let i = 0; i < hydratedArray.length; i++) {
      accumulator += template.replace(new RegExp(`this.${item}`, 'g'), `${target}[${i}]`);
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
