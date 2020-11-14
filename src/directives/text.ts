import compute from '../helpers/compute';
import { directiveArgs } from '../helpers/interfaces';

export const textDirective = ({ el, value, view }: directiveArgs) => {
  const out = compute(value, view);

  el.textContent = out ?? value; 
};
