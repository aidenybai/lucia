import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const joinDirective = ({ el, value, view }: DirectiveArgs) => {
  const parts = value.split('by ');
  const out = compute(parts[0], { $view: view, $el: el });

  if (out !== undefined) {
    el.innerHTML = out.join(parts[1] || '');
  } else {
    el.innerHTML = parts[0].join(parts[1] || '');
  }
};
