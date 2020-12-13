import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const ifDirective = ({ el, value, view }: DirectiveProps) => {
  // Need !! to assert as boolean
  const out = compute(value, { $view: view, $el: el });

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
