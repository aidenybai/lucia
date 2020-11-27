import compute from '../utils/compute';
import { createApp } from '../../App';
import { DirectiveArgs } from './IDirectiveArgs';

export const htmlDirective = ({ el, value, view }: DirectiveArgs) => {
  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);

  try {
    el.innerHTML = compute(value, { $view: view, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
