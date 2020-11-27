import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const ifDirective = ({ el, value, view }: DirectiveArgs) => {
  // Need !! to assert as boolean
  const out = !!compute(value, { $view: view, $el: el });

  el.hidden = !out;
};
