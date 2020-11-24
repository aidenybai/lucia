import compute from '../utils/compute';
import { createApp } from '../index';
import { DirectiveArgs } from './IDirectiveArgs';

export const joinDirective = ({ el, value, view }: DirectiveArgs) => {
  // Kind of bad way of implementing, quite bad on perf. 
  // Maybe think of a beter way in the future.
  const [array, contentType, delimiter] = value.split(/ as | by /);
  const out = compute(array, { $view: view, $el: el });

  // By default, use innerHTML
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
