import compute from '../utils/compute';
import { args } from './args';

export const ifDirective = ({ el, value, view }: args) => {
  const out = !!compute(value, { $view: view, $el: el });

  el.hidden = !out;
};
