import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const htmlDirective = ({ el, value, view }: DirectiveArgs) => {
  const out = compute(value, { $view: view, $el: el });

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
