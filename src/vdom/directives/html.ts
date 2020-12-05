import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const htmlDirective = ({ el, value, view }: DirectiveProps) => {
  // Create shallow nested Lucia app
  const app = createApp(Object.assign({}, view));
  app.mount(el, true);

  try {
    el.innerHTML = compute(value, { $view: view, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
