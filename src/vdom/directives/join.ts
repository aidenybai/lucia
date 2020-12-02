import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const joinDirective = ({ el, value, view }: DirectiveProps) => {
  // Kind of bad way of implementing, quite bad on perf.
  // Maybe think of a beter way in the future.
  const [array, contentType, delimiter] = value.split(/ as | by /);
  const out = compute(array, { $view: view, $el: el });

  // By default, use innerHTML
  const accessProp = contentType === 'text' ? 'innerText' : 'innerHTML';
  el[accessProp] = out.join(delimiter || '');

  // Create shallow nested Lucia app
  const app = createApp({ ...view });
  app.mount(el, true);
};
