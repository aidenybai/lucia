import compute from '../utils/compute';
import { args } from './args';

export const ifDirective = ({ el, value, view }: args) => {
  el.hidden = !compute(value, view);
};
