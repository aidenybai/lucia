import compute from '../utils/compute';
import { createApp } from '../index';
import { DirectiveArgs } from './IDirectiveArgs';

export const joinDirective = ({ el, value, view }: DirectiveArgs) => {
  const [array, delimiter] = value.split('by ');
  const out = compute(array, { $view: view, $el: el });

  if (out !== undefined) {
    el.innerHTML = out.join(delimiter || '');
  } else {
    el.innerHTML = array.join(delimiter || '');
  }

  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);
};
