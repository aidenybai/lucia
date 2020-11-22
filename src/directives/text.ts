import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const textDirective = ({ el, value, view }: DirectiveArgs) => {
  const out = compute(value, { $view: view, $el: el });

  el.textContent = out ?? value;
};
