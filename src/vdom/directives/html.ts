import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const htmlDirective = ({ el, value, view }: DirectiveProps) => {
  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);

  try {
    el.innerHTML = compute(value, { $view: view, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
