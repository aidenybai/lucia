import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const textDirective = ({ el, value, state }: DirectiveProps) => {
  try {
    el.innerHTML = compute(value, { $state: state, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
