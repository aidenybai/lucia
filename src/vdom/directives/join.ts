import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const joinDirective = ({ el, data, app }: DirectiveProps) => {
  // Kind of bad way of implementing, quite bad on perf.
  // Maybe think of a better way in the future.
  const [array, contentType, delimiter] = data.value.split(/ as | by /);
  const out = compute(array, { $el: el })(app.state);

  // By default, use innerHTML
  const accessProp = contentType === 'text' ? 'innerText' : 'innerHTML';
  el[accessProp] = out.join(delimiter || '');

  // Create shallow nested Lucia app
  const scope = createApp({ ...app.state });

  for (const [name, evaluationCallback] of Object.entries(app.directives || {})) {
    scope.directive(name, evaluationCallback);
  }

  for (const [name, templateCallback] of Object.entries(app.components || {})) {
    scope.component(name, templateCallback);
  }

  scope.mount(el);
};
