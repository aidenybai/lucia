import { DirectiveProps } from '../../models/structs';

import { createApp } from '../../App';

export const htmlDirective = ({ el, data, app }: DirectiveProps) => {
  el.innerHTML = data.compute(app.state) ?? data.value;

  // Create nested Lucia app
  const scope = createApp({ ...app.state });

  Object.entries(app.directives || {}).map(([name, evaluationCallback]) => {
    scope.directive(name, evaluationCallback);
  });

  Object.entries(app.components || {}).map(([name, templateCallback]) => {
    scope.component(name, templateCallback);
  });

  scope.mount(el);
};
