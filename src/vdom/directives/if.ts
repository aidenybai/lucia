import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';

export const ifDirective = ({ el, value, view }: DirectiveProps) => {
  // Need !! to assert as boolean
  const out = !!compute(value, { $view: view, $el: el });

  el.hidden = !out;
};
