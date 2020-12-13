import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const ifDirective = ({ el, value, state }: DirectiveProps) => {
  // Need !! to assert as boolean
  const out = compute(value, { $state: state, $el: el });

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
