import { DirectiveProps } from '../../defaults';

import compute from '../utils/compute';

export const textDirective = ({ el, value, view }: DirectiveProps) => {
  try {
    el.innerHTML = compute(value, { $view: view, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
