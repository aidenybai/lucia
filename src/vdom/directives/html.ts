import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const htmlDirective = ({ el, value, state }: DirectiveProps) => {
  // Create shallow nested Lucia app
  const app = createApp({ ...state });
  app.mount(el, true);

  try {
    el.innerHTML = compute(value, { $state: state, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
