import compute from '../utils/compute';
import { args } from './args';

export const textDirective = ({ el, value, view }: args) => {
  const out = compute(value, { $view: view, $el: el });

  el.textContent = out ?? value;
};
