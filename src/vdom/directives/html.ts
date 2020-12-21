import { DirectiveProps } from '../../models/structs';

import { createApp } from '../../App';

export const htmlDirective = ({ el, data, app }: DirectiveProps) => {
  el.innerHTML = data.compute(app.state);

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
