import compute from '../utils/compute';
import { createApp } from '../index';
import { DirectiveArgs } from './IDirectiveArgs';

export const joinDirective = ({ el, value, view }: DirectiveArgs) => {
  const [array, contentType, delimiter] = value.split(/ as | by /);
  const out = compute(array, { $view: view, $el: el });

  // By default
  const accessProp = contentType === 'text' ? 'innerText' : 'innerHTML';
  if (out !== undefined) {
    el[accessProp] = out.join(delimiter || '');
  } else {
    el[accessProp] = array.join(delimiter || '');
  }

  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);
};
