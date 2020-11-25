import compute from '../utils/compute';
import { createApp } from '../index';
import { DirectiveArgs } from './IDirectiveArgs';

export const htmlDirective = ({ el, value, view }: DirectiveArgs) => {

  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);

  let out;

  try {
    out = compute(value, { $view: view, $el: el });
  } catch {
    out = value;
  }

  el.innerHTML = out;
};
