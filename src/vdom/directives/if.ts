import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';

export const ifDirective = ({ el, value, view }: DirectiveProps) => {
  // Need !! to assert as boolean
  const out = compute(value, { $view: view, $el: el });

  console.log(out);

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
