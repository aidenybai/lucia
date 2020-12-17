import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';
import { createApp } from '../../App';

export const joinDirective = ({ el, data, state }: DirectiveProps) => {
  // Kind of bad way of implementing, quite bad on perf.
  // Maybe think of a better way in the future.
  const [array, contentType, delimiter] = data.value.split(/ as | by /);
  const out = compute(array, { $el: el })(state);

  // By default, use innerHTML
  const accessProp = contentType === 'text' ? 'innerText' : 'innerHTML';
  el[accessProp] = out.join(delimiter || '');

  // Create shallow nested Lucia app
  const app = createApp({ ...state });
  app.mount(el, true);
};
