import compute from '../utils/compute';
import { args } from './args';

export const htmlDirective = ({ el, value, view }: args) => {
  const out = compute(value, view);

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
