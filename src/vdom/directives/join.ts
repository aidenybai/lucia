import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const joinDirective = ({ el, data, app }: DirectiveProps) => {
  // Kind of bad way of implementing, quite bad on perf.
  // Maybe think of a better way in the future.
  const [array, contentType, delimiter] = data.value.split(/ as | by /);
  const hydratedArray = compute(array, { $el: el })(app.state);

  // By default, use innerHTML
  const accessProp = contentType === 'text' ? 'innerText' : 'innerHTML';
  el[accessProp] = hydratedArray.join(delimiter || '');

  // Create shallow Lucia app
  const scope = createApp({ ...app.state });

  Object.entries(app.directives || {}).map(([name, evaluationCallback]) => {
    scope.directive(name, evaluationCallback);
  });

  Object.entries(app.components || {}).map(([name, templateCallback]) => {
    scope.component(name, templateCallback);
  });

  scope.mount(el);
};
